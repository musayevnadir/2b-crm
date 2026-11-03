# Объекты и задачи

Мини-CRM для строительной компании. Постановщик создаёт объекты и задачи, исполнитель выполняет свои задачи и отправляет на проверку.

Демо: https://2b-crm.vercel.app

## Тестовые пользователи

Регистрации в приложении нет, пользователи создаются вручную в Supabase.

| Роль        | Email                 | Пароль         |
| ----------- | --------------------- | -------------- |
| Постановщик | manager@example.com   | Admin123!      |
| Исполнитель | executor1@example.com | Executor1!@123 |
| Исполнитель | executor2@example.com | Executor1!@345 |

## Стек

Next.js, TypeScript, Supabase, Tailwind, shadcn/ui, React Hook Form, Zod.

## Локальный запуск

Значения для `.env.development` отправлены в личном сообщении. С ними проект подключится к той же базе, что и демо, все пользователи и данные уже есть.

1. Создайте в корне проекта файл `.env.development` и вставьте присланные значения:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_PROJECT_ID=
```

2. Установите зависимости и запустите:

```bash
yarn install
yarn dev
```

Приложение откроется на http://localhost:3000

## Своя база Supabase

Если нужно поднять проект на своей базе:

```bash
supabase link --project-ref <project-ref>
yarn db:push
```

Пользователей создаёте в Supabase (Authentication → Users). По умолчанию роль исполнителя, постановщика назначаете так:

```sql
update public.profiles set role = 'manager' where email = '...';
```

## Где смотреть код

`supabase/migrations`: таблицы, RLS-политики, функция смены статуса и триггеры. Вся защита данных здесь.

`src/services`: все запросы к Supabase.

`src/modules`: экраны и формы: вход, объекты, задачи.

`src/config/task-transitions.ts`: какие кнопки статусов видит пользователь.

## Безопасность

Права проверяются в базе через RLS, поэтому их не обойти прямым запросом к Supabase. Статус меняется только функцией `change_task_status`, она проверяет роль и допустимый переход. История пишется триггером, изменить или удалить её нельзя. Регистрация отключена.

Проверка: `yarn test:security`

## Проверка кода

```bash
yarn check
```

TypeScript и ESLint.
