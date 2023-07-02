import { z } from 'zod'

export const GuestEntrySchema = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  message: z.string().min(1),
  updatedAt: z.date().optional()
})

export type GuestEntry = z.infer<typeof GuestEntrySchema>
