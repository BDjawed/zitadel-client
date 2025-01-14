import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserPasskeyDeletePathSchema = ZitadelUserByIdGetPathSchema.extend({
  passkeyId: z.string().min(1, 'Passkey ID is required'),
})

export type ZitadelUserPasskeyDeletePathDto = z.infer<typeof ZitadelUserPasskeyDeletePathSchema>
