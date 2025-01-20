import { z } from 'zod'

export const ZitadelHealthCheckResponseSchema = z.object({ })

export type ZitadelHealthCheckResponse = z.infer<typeof ZitadelHealthCheckResponseSchema>
