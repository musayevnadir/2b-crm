const DB_ERRORS: Record<string, string> = {
  transition_not_allowed: "Этот переход статуса сейчас недоступен",
  comment_required: "Укажите комментарий",
  task_not_found: "Задача не найдена или нет доступа",
  not_authenticated: "Войдите в систему",
  assignee_must_be_executor:
    "Исполнителем может быть только пользователь с ролью «Исполнитель»",
  status_change_only_via_function: "Статус меняется только кнопками действий",
};

export function dbErrorMessage(message: string | undefined, fallback: string) {
  if (!message) return fallback;
  const key = Object.keys(DB_ERRORS).find((code) => message.includes(code));
  return key ? DB_ERRORS[key] : fallback;
}
