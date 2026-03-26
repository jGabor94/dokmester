import { z } from "zod";

export const navDataFormSchema = z.object({
  username: z.string().length(15),
  password: z.string().min(3),
  signatureKey: z.string().min(3),
  exchangeKey: z.string().min(3),
})