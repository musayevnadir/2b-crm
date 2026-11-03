import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const USERS = {
  manager: [process.env.TEST_MANAGER_EMAIL, process.env.TEST_MANAGER_PASSWORD],
  executor1: [
    process.env.TEST_EXECUTOR1_EMAIL,
    process.env.TEST_EXECUTOR1_PASSWORD,
  ],
  executor2: [
    process.env.TEST_EXECUTOR2_EMAIL,
    process.env.TEST_EXECUTOR2_PASSWORD,
  ],
};

for (const [role, [email, password]] of Object.entries(USERS)) {
  if (!email || !password) {
    console.error(
      `Нет логина/пароля для ${role} в .env.development (TEST_*_EMAIL / TEST_*_PASSWORD)`,
    );
    process.exit(1);
  }
}

const results = [];

function check(name, ok, details = "") {
  results.push({ name, ok });
  console.log(
    `${ok ? "✅" : "❌"} ${name}${!ok && details ? ` — ${details}` : ""}`,
  );
}

const denied = (res) =>
  !!res.error || (Array.isArray(res.data) && res.data.length === 0);
const errorHas = (res, code) => !!res.error && res.error.message.includes(code);

function client() {
  return createClient(URL, KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function signIn(role) {
  const supabase = client();
  const [email, password] = USERS[role];
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(`Не удалось войти как ${role}: ${error.message}`);
  return { supabase, id: data.user.id };
}

const anon = client();
const manager = await signIn("manager");
const e1 = await signIn("executor1");
const e2 = await signIn("executor2");

const { data: object } = await manager.supabase
  .from("objects")
  .insert({ name: "SECURITY TEST", address: "тест" })
  .select()
  .single();

const { data: t1 } = await manager.supabase
  .from("tasks")
  .insert({
    object_id: object.id,
    title: "T1",
    description: "",
    assignee_id: e1.id,
  })
  .select()
  .single();

const { data: t2 } = await manager.supabase
  .from("tasks")
  .insert({
    object_id: object.id,
    title: "T2",
    description: "",
    assignee_id: e2.id,
  })
  .select()
  .single();

try {
  console.log("\n— Без входа (anon) —");
  check("anon не читает задачи", denied(await anon.from("tasks").select("id")));
  check(
    "anon не читает объекты",
    denied(await anon.from("objects").select("id")),
  );
  check(
    "anon не читает профили",
    denied(await anon.from("profiles").select("id")),
  );
  check(
    "anon не читает историю",
    denied(await anon.from("task_history").select("id")),
  );
  check(
    "anon не вызывает change_task_status",
    !!(
      await anon.rpc("change_task_status", {
        p_task_id: t1.id,
        p_status: "in_progress",
      })
    ).error,
  );

  console.log("\n— Исполнитель 1 —");
  const e1Tasks = (await e1.supabase.from("tasks").select("id")).data ?? [];
  check(
    "видит свою задачу",
    e1Tasks.some((t) => t.id === t1.id),
  );
  check("не видит чужую задачу в списке", !e1Tasks.some((t) => t.id === t2.id));
  check(
    "не открывает чужую задачу по id",
    denied(await e1.supabase.from("tasks").select("id").eq("id", t2.id)),
  );
  check(
    "не видит историю чужой задачи",
    denied(
      await e1.supabase.from("task_history").select("id").eq("task_id", t2.id),
    ),
  );
  check(
    "видит объект, где есть его задача",
    (
      (await e1.supabase.from("objects").select("id").eq("id", object.id))
        .data ?? []
    ).length === 1,
  );

  const e1Profiles =
    (await e1.supabase.from("profiles").select("id, role")).data ?? [];
  check(
    "видит свой профиль",
    e1Profiles.some((p) => p.id === e1.id),
  );
  check(
    "видит профиль постановщика",
    e1Profiles.some((p) => p.id === manager.id),
  );
  check(
    "НЕ видит профиль другого исполнителя",
    !e1Profiles.some((p) => p.id === e2.id),
  );

  await e1.supabase.from("tasks").update({ title: "HACK" }).eq("id", t1.id);
  const t1AfterHack = (
    await manager.supabase
      .from("tasks")
      .select("title, status")
      .eq("id", t1.id)
      .single()
  ).data;
  check("не меняет название своей задачи напрямую", t1AfterHack.title === "T1");

  await e1.supabase
    .from("tasks")
    .update({ status: "accepted" })
    .eq("id", t1.id);
  check(
    "не меняет статус напрямую",
    (
      await manager.supabase
        .from("tasks")
        .select("status")
        .eq("id", t1.id)
        .single()
    ).data.status === "new",
  );

  check(
    "не создаёт задачу",
    !!(
      await e1.supabase
        .from("tasks")
        .insert({ object_id: object.id, title: "X", assignee_id: e1.id })
    ).error,
  );
  check(
    "не создаёт объект",
    !!(await e1.supabase.from("objects").insert({ name: "X", address: "X" }))
      .error,
  );

  await e1.supabase.from("tasks").delete().eq("id", t1.id);
  check(
    "не удаляет задачу",
    (
      (await manager.supabase.from("tasks").select("id").eq("id", t1.id))
        .data ?? []
    ).length === 1,
  );

  await e1.supabase.from("objects").delete().eq("id", object.id);
  check(
    "не удаляет объект",
    (
      (await manager.supabase.from("objects").select("id").eq("id", object.id))
        .data ?? []
    ).length === 1,
  );

  check(
    "не пишет в историю напрямую",
    !!(
      await e1.supabase
        .from("task_history")
        .insert({ task_id: t1.id, to_status: "accepted", changed_by: e1.id })
    ).error,
  );

  check(
    "не меняет свою роль на manager",
    !!(
      await e1.supabase
        .from("profiles")
        .update({ role: "manager" })
        .eq("id", e1.id)
    ).error ||
      (
        await manager.supabase
          .from("profiles")
          .select("role")
          .eq("id", e1.id)
          .single()
      ).data.role === "executor",
  );

  check(
    "не узнаёт роль через is_executor",
    !!(await e1.supabase.rpc("is_executor", { p_profile_id: e2.id })).error,
  );

  check(
    "не меняет статус чужой задачи (task_not_found)",
    errorHas(
      await e1.supabase.rpc("change_task_status", {
        p_task_id: t2.id,
        p_status: "in_progress",
      }),
      "task_not_found",
    ),
  );

  check(
    "запрещённый переход Новая → Принята",
    errorHas(
      await e1.supabase.rpc("change_task_status", {
        p_task_id: t1.id,
        p_status: "accepted",
      }),
      "transition_not_allowed",
    ),
  );

  check(
    "Новая → В работе (свой исполнитель)",
    !(
      await e1.supabase.rpc("change_task_status", {
        p_task_id: t1.id,
        p_status: "in_progress",
      })
    ).error,
  );

  check(
    "В работе → На проверке (свой исполнитель)",
    !(
      await e1.supabase.rpc("change_task_status", {
        p_task_id: t1.id,
        p_status: "review",
      })
    ).error,
  );

  check(
    "исполнитель не принимает свою задачу",
    errorHas(
      await e1.supabase.rpc("change_task_status", {
        p_task_id: t1.id,
        p_status: "accepted",
      }),
      "transition_not_allowed",
    ),
  );

  console.log("\n— Постановщик —");
  check(
    "На доработку без комментария → ошибка",
    errorHas(
      await manager.supabase.rpc("change_task_status", {
        p_task_id: t1.id,
        p_status: "rework",
        p_comment: "   ",
      }),
      "comment_required",
    ),
  );

  check(
    "На проверке → На доработке с комментарием",
    !(
      await manager.supabase.rpc("change_task_status", {
        p_task_id: t1.id,
        p_status: "rework",
        p_comment: "Исправить",
      })
    ).error,
  );

  check(
    "постановщик не берёт задачу в работу за исполнителя",
    errorHas(
      await manager.supabase.rpc("change_task_status", {
        p_task_id: t1.id,
        p_status: "in_progress",
      }),
      "transition_not_allowed",
    ),
  );

  check(
    "постановщик не меняет статус напрямую",
    errorHas(
      await manager.supabase
        .from("tasks")
        .update({ status: "accepted" })
        .eq("id", t1.id),
      "status_change_only_via_function",
    ),
  );

  await manager.supabase
    .from("tasks")
    .update({ author_id: e1.id })
    .eq("id", t1.id);
  check(
    "автор задачи не подменяется",
    (
      await manager.supabase
        .from("tasks")
        .select("author_id")
        .eq("id", t1.id)
        .single()
    ).data.author_id === manager.id,
  );

  check(
    "нельзя назначить задачу постановщику",
    errorHas(
      await manager.supabase
        .from("tasks")
        .update({ assignee_id: manager.id })
        .eq("id", t1.id),
      "assignee_must_be_executor",
    ),
  );

  const { data: forced } = await manager.supabase
    .from("tasks")
    .insert({
      object_id: object.id,
      title: "T3",
      assignee_id: e1.id,
      status: "accepted",
      author_id: e1.id,
    })
    .select("status, author_id")
    .single();
  check(
    "новая задача всегда «Новая» и автор = кто создал",
    forced?.status === "new" && forced?.author_id === manager.id,
  );

  const history =
    (
      await manager.supabase
        .from("task_history")
        .select("from_status, to_status, comment")
        .eq("task_id", t1.id)
        .order("created_at")
    ).data ?? [];
  const path = history
    .map((h) => `${h.from_status ?? "—"}→${h.to_status}`)
    .join(", ");
  check(
    "история записана полностью",
    path === "—→new, new→in_progress, in_progress→review, review→rework" &&
      history[3]?.comment === "Исправить",
    path,
  );

  const historyId = (
    await manager.supabase
      .from("task_history")
      .select("id")
      .eq("task_id", t1.id)
      .limit(1)
      .single()
  ).data.id;
  await manager.supabase.from("task_history").delete().eq("id", historyId);
  await manager.supabase
    .from("task_history")
    .update({ comment: "FAKE" })
    .eq("task_id", t1.id);
  const historyAfter =
    (
      await manager.supabase
        .from("task_history")
        .select("id, comment")
        .eq("task_id", t1.id)
    ).data ?? [];
  check(
    "историю нельзя удалить или изменить даже постановщику",
    historyAfter.length === 4 &&
      !historyAfter.some((h) => h.comment === "FAKE"),
  );

  console.log("\n— Исполнитель 2 —");
  check(
    "не видит задачу исполнителя 1",
    denied(await e2.supabase.from("tasks").select("id").eq("id", t1.id)),
  );
  check(
    "видит свою задачу",
    ((await e2.supabase.from("tasks").select("id").eq("id", t2.id)).data ?? [])
      .length === 1,
  );
} finally {
  await manager.supabase.from("objects").delete().eq("id", object.id);
  const left =
    (await manager.supabase.from("objects").select("id").eq("id", object.id))
      .data ?? [];
  console.log(`\nТестовые данные удалены: ${left.length === 0 ? "да" : "НЕТ"}`);
}

const failed = results.filter((r) => !r.ok).length;
console.log(
  `\nИтого: ${results.length - failed} из ${results.length} проверок пройдено`,
);
process.exit(failed ? 1 : 0);
