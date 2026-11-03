import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Введите название")
    .max(200, "Слишком длинно"),
  description: z.string().trim().max(2000, "Слишком длинно"),
  assignee_id: z.string().min(1, "Выберите исполнителя"),
});

export type TaskValues = z.infer<typeof taskSchema>;
