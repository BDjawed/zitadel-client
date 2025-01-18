import { ApiEndpointsV2 } from '../../../enums'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelUserOtpEmailDeleteResponse, ZitadelUserOtpSmsDeleteResponse } from '../../../responses'

export class OtpService {
  constructor(private httpClient: HttpClient) { }

  /**
   * Deletes the configured One-Time Password (OTP) SMS factor for a user.
   *
   * Note: As only one OTP SMS per user is allowed, the user will not have OTP SMS as a second factor afterward.
   *
   * @param {string} userId - The ID of the user whose OTP SMS configuration is to be deleted.
   * @returns {Promise<ZitadelUserOtpSmsDeleteResponse>} A promise that resolves to the response indicating the result of the OTP SMS deletion operation.
   * @throws {Error} If the request fails.
   */
  async deleteOtpSms(
    userId: string,
  ): Promise<ZitadelUserOtpSmsDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/otp_sms`

    const response: ZitadelUserOtpSmsDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  /**
   * Deletes the configured One-Time Password (OTP) Email factor for a user.
   *
   * Note: As only one OTP Email per user is allowed, the user will not have OTP Email as a second factor afterward.
   *
   * @param {string} userId - The ID of the user whose OTP Email configuration is to be deleted.
   * @returns {Promise<ZitadelUserOtpEmailDeleteResponse>} A promise that resolves to the response indicating the result of the OTP Email deletion operation.
   * @throws {Error} If the request fails.
   */
  async deleteOtpEmail(
    userId: string,
  ): Promise<ZitadelUserOtpEmailDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/otp_email`

    const response: ZitadelUserOtpEmailDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }
}
