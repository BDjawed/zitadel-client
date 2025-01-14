import { HTTPError } from 'ky'
import { z } from 'zod'

export const ExtendedHttpErrorSchema = z.intersection(
  z.instanceof(HTTPError),
  z.object({
    extractedBody: z.any(),
  }),
)
export type ExtendedHttpError = z.infer<typeof ExtendedHttpErrorSchema>
/*
* This interceptor extracts the body of the response and attaches it to the error object.
* Motivation: ZITADEL returns quite detailed error messages in the body of the response.
*/
export async function extendedErrorInterceptor(error: ExtendedHttpError): Promise<ExtendedHttpError> {
  const parsedError = ExtendedHttpErrorSchema.parse(error)
  parsedError.extractedBody = await parsedError.response.json().catch(() => parsedError)
  return parsedError.extractedBody
}
