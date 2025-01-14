import { z } from 'zod'

export const DetailsSchema = z.object({
  sequence: z.string().min(1, 'Sequence is required'),
  creationDate: z.date().optional(),
  changeDate: z.date().optional(),
  resourceOwner: z.string().min(1, 'Resource owner is required'),
})

export type Details = z.infer<typeof DetailsSchema>
