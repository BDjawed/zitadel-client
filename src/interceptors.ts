import type { HTTPError } from 'ky'

interface ExtendedHttpError extends HTTPError {
  extractedBody: any
}

/*
* This interceptor extracts the body of the response and attaches it to the error object.
* Motivation: ZITADEL returns quite detailed error messages in the body of the response.
*/
export async function extendedErrorInterceptor(error: ExtendedHttpError): Promise<ExtendedHttpError> {
  try {
    error.extractedBody = await error.response.json()
  }
  catch {
    // Server did not return JSON
  }
  return error
}
