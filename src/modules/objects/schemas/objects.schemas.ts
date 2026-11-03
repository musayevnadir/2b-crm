import { z } from "zod";

export const objectSchema = z.object({
  name: z.string().trim().min(1, "Введите название").max(200, "Слишком длинно"),
  address: z.string().trim().min(1, "Введите адрес").max(300, "Слишком длинно"),
});

export type ObjectValues = z.infer<typeof objectSchema>;
