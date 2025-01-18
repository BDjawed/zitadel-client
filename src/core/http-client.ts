import ky, { type HTTPError, type KyInstance } from 'ky'
import { extendedErrorInterceptor } from '../interceptors'
import type { ZitadelClientOptions } from '../interfaces'

export class HttpClient {
  private httpClient: KyInstance
  private httpClientPure: KyInstance

  constructor(options: ZitadelClientOptions) {
    this.httpClient = ky.create({
      prefixUrl: options.issuerUrl,
      hooks: {
        beforeError: [extendedErrorInterceptor as unknown as (error: HTTPError) => Promise<HTTPError>],
      },
    })
    this.httpClientPure = ky.create({
      hooks: {
        beforeError: [extendedErrorInterceptor as unknown as (error: HTTPError) => Promise<HTTPError>],
      },
    })
  }

  updateAuthToken(accessToken: string): void {
    this.httpClient = this.httpClient.extend({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    this.httpClientPure = this.httpClientPure.extend({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  get client(): KyInstance {
    return this.httpClient
  }

  get pureClient(): KyInstance {
    return this.httpClientPure
  }
}
