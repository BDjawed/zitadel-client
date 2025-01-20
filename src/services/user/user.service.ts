import { ApiEndpointsV1, ApiEndpointsV2, UsersEndpointsV1 } from '../../enums'
import { UserHumanService } from './human/user.human.service'
import { UserMachineService } from './machine/user.machine.service'
import { MetadataService } from './metadata/metadata.service'
import { OtpService } from './otp/otp.service'
import { PasskeyService } from './passkey/passkey.service'
import { TotpService } from './totp/totp.service'
import { U2fService } from './u2f/u2f.service'
import type { HttpClient } from '../../core/http-client'
import type { ZitadelUserAuthenticationMethodsGetQueryDto, ZitadelUserEmailCreatePostDto, ZitadelUserExistingCheckByUserNameOrEmailDto, ZitadelUserHistoryPostDto, ZitadelUserPasswordCreateDto, ZitadelUserPasswordResetCodeCreateDto, ZitadelUserPermissionsGetDto, ZitadelUserPhoneCreateDto, ZitadelUserResendVerifyCodeByEmailPostDto, ZitadelUserResendVerifyCodeByPhonePostDto, ZitadelUsersSearchDto } from '../../dtos'
import type { ZitadelUserAuthenticationMethodsGetResponse, ZitadelUserAvatarDeleteResponse, ZitadelUserByIdGetResponse, ZitadelUserByLoginNameGetResponse, ZitadelUserDeactivatePostResponse, ZitadelUserDeleteResponse, ZitadelUserEmailCreateResponse, ZitadelUserExistingCheckGetResponse, ZitadelUserHistoryPostResponse, ZitadelUserLockPostResponse, ZitadelUserPasswordCreateResponse, ZitadelUserPasswordResetCodeCreateResponse, ZitadelUserPermissionsGetResponseDto, ZitadelUserPhoneCreateResponse, ZitadelUserPhoneDeleteResponse, ZitadelUserReactivatePostResponse, ZitadelUserResendVerifyCodeByEmailPostResponse, ZitadelUserResendVerifyCodeByPhonePostResponse, ZitadelUsersSearchPostResponse, ZitadelUserUnlockPostResponse } from '../../responses'

export class UserService {
  private userHumanService: UserHumanService
  private userMachineService: UserMachineService
  private metadataService: MetadataService
  private totpService: TotpService
  private u2fService: U2fService
  private otpService: OtpService
  private passkeyService: PasskeyService
  constructor(private httpClient: HttpClient) {
    this.userHumanService = new UserHumanService(this.httpClient)
    this.userMachineService = new UserMachineService(this.httpClient)
    this.metadataService = new MetadataService(httpClient)
    this.totpService = new TotpService(httpClient)
    this.u2fService = new U2fService(httpClient)
    this.otpService = new OtpService(httpClient)
    this.passkeyService = new PasskeyService(httpClient)
  }

  get metadata(): MetadataService {
    return this.metadataService
  }

  get totp(): TotpService {
    return this.totpService
  }

  get u2f(): U2fService {
    return this.u2fService
  }

  get otp(): OtpService {
    return this.otpService
  }

  get passkey(): PasskeyService {
    return this.passkeyService
  }

  get human(): UserHumanService {
    return this.userHumanService
  }

  get machine(): UserMachineService {
    return this.userMachineService
  }

  /**
   * Deactivates a user.
   * The state of the user will be changed to 'deactivated'.
   *
   * The user will not be able to log in anymore. The method returns an error if the user is already in the state 'deactivated'.
   *
   * Use deactivate user when the user should not be able to use the account anymore,
   * but you still need access to the user data..
   *
   * @param {string} userId - The ID of the user to deactivate.
   * @returns {Promise<ZitadelUserDeactivatePostResponse>} The deactivate user response.
   * @throws {Error} If the request failed.
   */
  async deactivate(
    userId: string,
  ): Promise<ZitadelUserDeactivatePostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${userId}/deactivate`)

    const response: ZitadelUserDeactivatePostResponse = await this.httpClient.client.post(url, {
      json: {},
    }).json()

    return response
  }

  /**
   * Reactivates a user.
   *
   * Reactivate a user with the state 'deactivated'.
   *
   * The user will be able to log in again afterward.
   *
   * The method returns an error if the user is not in the state 'deactivated'..
   *
   * @param {string} userId - The ID of the user to reactivate.
   * @returns {Promise<ZitadelUserReactivatePostResponse>} The reactivate user response.
   * @throws {Error} If the request failed.
   */
  async reactivate(
    userId: string,
  ): Promise<ZitadelUserReactivatePostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${userId}/reactivate`)

    const response: ZitadelUserReactivatePostResponse = await this.httpClient.client.post(url, {
      json: {},
    }).json()

    return response
  }

  /**
   * Locks a user account.
   *
   * The state of the user will be changed to 'locked'.
   *
   * The user will not be able to log in anymore. The method returns an error if the user is already in the state 'locked'.
   *
   * Use this method if the user should not be able to log in temporarily because of an event that happened (wrong password, etc.)..
   *
   * @param {string} userId - The ID of the user to lock.
   * @returns {Promise<ZitadelUserLockPostResponse>} The lock user response.
   * @throws {Error} If the request failed.
   */
  async lock(
    userId: string,
  ): Promise<ZitadelUserLockPostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${userId}/lock`)

    const response: ZitadelUserLockPostResponse = await this.httpClient.client.post(url, {
      json: {},
    }).json()

    return response
  }

  /**
   * Unlocks a user account.
   *
   * Unlock a previously locked user and change the state to 'active'.
   *
   * The user will be able to log in again.
   *
   * The method returns an error if the user is not in the state 'locked'.
   *
   * @param {string} userId - The ID of the user to unlock.
   * @returns {Promise<ZitadelUserUnlockPostResponse>} The unlock user response.
   * @throws {Error} If the request failed.
   */
  async unlock(
    userId: string,
  ): Promise<ZitadelUserUnlockPostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${userId}/unlock`)

    const response: ZitadelUserUnlockPostResponse = await this.httpClient.client.post(url, {
      json: {},
    }).json()

    return response
  }

  /**
   * Retrieves a user by ID.
   *
   * Returns the full user object (human or machine) including the profile, email, etc..
   * @param {string} userId - The unique identifier of the user to retrieve.
   * @returns {Promise<ZitadelUserByIdGetResponse>} A promise that resolves to the user data.
   * @throws {Error} Thrown if the user ID is not provided, user not found or access is forbidden.
   */
  async getById(
    userId: string,
  ): Promise<ZitadelUserByIdGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}`
    const response: ZitadelUserByIdGetResponse = await this.httpClient.client.get(url).json()

    return response
  }

  /**
   * Deletes a user by ID.
   *
   * The state of the user will be changed to 'deleted'.
   *
   * The user will not be able to log in anymore. Methods requesting this user will return an error 'User not found..
   *
   * @param {string} userId - The unique identifier of the user to delete.
   * @returns {Promise<ZitadelUserDeleteResponse>} The response containing the deleted user data.
   * @throws {Error} If the request fails.
   */
  async deleteById(
    userId: string,
  ): Promise<ZitadelUserDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}`
    const response: ZitadelUserDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  /**
   * Retrieves a user by login name.
   *
   * Get a user by login name searched over all organizations.
   *
   * The request only returns data if the login name matches exactly.
   *
   * @deprecated Use {@link usersSearch()} instead.
   *
   * @see {@link usersSearch()} for the recommended method to retrieve users.
   * @param {string} loginName - The login name of the user to retrieve.
   * @returns {Promise<ZitadelUserByLoginNameGetResponse>} A promise that resolves to the user data.
   * @throws {Error} Thrown if the loginName is not provided, user not found or access is forbidden.
   */
  async getByLoginName(
    loginName: string,
  ): Promise<ZitadelUserByLoginNameGetResponse> {
    const url = `${ApiEndpointsV1.GLOBAL_USERS}?loginName=${loginName}`

    const response: ZitadelUserByLoginNameGetResponse = await this.httpClient.client.get(url).json()

    return response
  }

  /**
   * Retrieves a list of users based on the given search query.
   *
   * Search for users.
   *
   * By default, we will return all users of your instance that you have permission to read.
   * Make sure to include a limit and sorting for pagination.
   *
   * @param {ZitadelUsersSearchDto} dto - The search query.
   * @returns {Promise<ZitadelUsersSearchPostResponse>} A promise that resolves to the list of users.
   * @throws {Error} Thrown if the request fails.
   */
  async search(
    dto: ZitadelUsersSearchDto,
  ): Promise<ZitadelUsersSearchPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace('/:userId', '')}`
    const response: ZitadelUsersSearchPostResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Retrieves a list of history events for the given user.
   *
   * Returns a list of changes/events that have happened on the user.
   *
   * It's the history of the user. Make sure to send a limit.
   *
   * @param {string} userId - The unique identifier of the user to retrieve the history for.
   * @param {ZitadelUserHistoryPostDto} dto - The query parameters for the search.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserHistoryPostResponse>} A promise that resolves to the list of user history events.
   * @throws {Error} Thrown if the request fails.
   */
  async getHistory(
    userId: string,
    dto: ZitadelUserHistoryPostDto,
    orgId?: string,
  ): Promise<ZitadelUserHistoryPostResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = UsersEndpointsV1.USER_HISTORY.replace(':userId', userId)

    const response: ZitadelUserHistoryPostResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

    return response
  }

  /**
   * Checks if a user is unique.
   *
   * Returns if a user with the requested email or username is unique. So you can create the user.
   *
   * @deprecated Use {@link usersSearch()} instead.
   *
   * @see {@link usersSearch()} for more information.
   *
   * @param {ZitadelUserExistingCheckByUserNameOrEmailDto} dto - The query parameters for the search.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserExistingCheckGetResponse>} A promise that resolves to the result of the uniqueness check.
   * @throws {Error} Thrown if the request fails.
   */
  async isUnique(
    dto: ZitadelUserExistingCheckByUserNameOrEmailDto,
    orgId?: string,
  ): Promise<ZitadelUserExistingCheckGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    if (!dto.email && !dto.userName) {
      throw new Error('At least one of email or userName must be provided')
    }
    const searchParams = new URLSearchParams()

    if (dto.email) {
      searchParams.set('email', dto.email)
    }

    if (dto.userName) {
      searchParams.set('userName', dto.userName)
    }

    const url = `${UsersEndpointsV1.IS_UNIQUE}`

    const response: ZitadelUserExistingCheckGetResponse = await this.httpClient.client.get(url, {
      searchParams,
      headers,
    }).json()

    // If the user is not unique, the response will be an empty object
    if (!response.isUnique) {
      response.isUnique = false
    }

    return response
  }

  /**
   * Delete a user avatar.
   *
   * Removes the avatar that is currently set on the user.
   *
   * @param {string} userId - The ID of the user to delete the avatar for.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserAvatarDeleteResponse>} A promise that resolves to the response containing the deleted avatar data.
   * @throws {Error} Thrown if the request fails.
   */
  async deleteAvatar(
    userId: string,
    orgId?: string,
  ): Promise<ZitadelUserAvatarDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER_AVATAR.replace(':userId', userId)}`

    const response: ZitadelUserAvatarDeleteResponse = await this.httpClient.client.delete(url, {
      headers,
    }).json()

    return response
  }

  /**
   * Creates a new email for a user.
   *
   * Change the email address of a user.
   * If the state is set to not verified, a verification code will be generated,
   * which can be either returned or sent to the user by email..
   *
   * @param {string} userId - The ID of the user to create the email address for.
   * @param {ZitadelUserEmailCreatePostDto} dto - The DTO containing the new email address.
   * @returns {Promise<ZitadelUserEmailCreateResponse>} A promise that resolves to the response containing the created email address.
   * @throws {Error} Thrown if the request fails.
   */
  async createEmail(
    userId: string,
    dto: ZitadelUserEmailCreatePostDto,
  ): Promise<ZitadelUserEmailCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/email`

    const response: ZitadelUserEmailCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Deletes a phone number for a user.
   *
   * @param {string} userId - The ID of the user to delete the phone number for.
   * @returns {Promise<ZitadelUserPhoneDeleteResponse>} A promise that resolves to the response containing the deleted phone number.
   * @throws {Error} Thrown if the request fails.
   */
  async deletePhone(
    userId: string,
  ): Promise<ZitadelUserPhoneDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/phone`
    const response: ZitadelUserPhoneDeleteResponse = await this.httpClient.client.delete(url, {
      json: {},
    }).json()

    return response
  }

  /**
   * Creates a new phone number for a user.
   *
   * Set the phone number of a user. If the state is set to not verified, a verification code will be generated,
   *  which can be either returned or sent to the user by sms..
   *
   * @param {string} userId - The ID of the user to create the phone number for.
   * @param {ZitadelUserPhoneCreateDto} dto - The DTO containing the new phone number information.
   * @returns {Promise<ZitadelUserPhoneCreateResponse>} A promise that resolves to the response containing the created phone number details.
   * @throws {Error} Thrown if the request fails.
   */
  async createPhone(
    userId: string,
    dto: ZitadelUserPhoneCreateDto,
  ): Promise<ZitadelUserPhoneCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/phone`

    const response: ZitadelUserPhoneCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Creates a password for a user.
   *
   * Change the password of a user with either a verification code or the current password..
   *
   * @param {string} userId - The ID of the user to create the password for.
   * @param {ZitadelUserPasswordCreateDto} dto - The DTO containing the password information.
   * @returns {Promise<ZitadelUserPasswordCreateResponse>} A promise that resolves to the response containing the created password details.
   * @throws {Error} Thrown if the request fails.
   */
  async createPassword(
    userId: string,
    dto: ZitadelUserPasswordCreateDto,
  ): Promise<ZitadelUserPasswordCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/password`

    const response: ZitadelUserPasswordCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Creates a password reset code for a user.
   *
   * Request a verification code to reset a password..
   *
   * @param {string} userId - The ID of the user to create the password reset code for.
   * @param {ZitadelUserPasswordResetCodeCreateDto} dto - The DTO containing the password reset information.
   * @returns {Promise<ZitadelUserPasswordResetCodeCreateResponse>} A promise that resolves to the response containing the created password reset code.
   * @throws {Error} Thrown if the request fails.
   */
  async createPasswordResetCode(
    userId: string,
    dto: ZitadelUserPasswordResetCodeCreateDto,
  ): Promise<ZitadelUserPasswordResetCodeCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/password_reset`

    const response: ZitadelUserPasswordResetCodeCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Resend the verification code for a user's email address.
   *
   * Resend code to verify user email.
   *
   * @param {string} userId - The ID of the user to resend the verification code for.
   * @param {ZitadelUserResendVerifyCodeByEmailPostDto} dto - The DTO containing the resend verification code information.
   * @returns {Promise<ZitadelUserResendVerifyCodeByEmailPostResponse>} A promise that resolves to the response containing the resent verification code details.
   * @throws {Error} Thrown if the request fails.
   */
  async resendEmailVerificationCode(
    userId: string,
    dto: ZitadelUserResendVerifyCodeByEmailPostDto,
  ): Promise<ZitadelUserResendVerifyCodeByEmailPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/email/resend`

    const response: ZitadelUserResendVerifyCodeByEmailPostResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Resend the verification code for a user's phone number.
   *
   * Resend code to verify user phone.
   *
   * @param {string} userId - The ID of the user to resend the verification code for.
   * @param {ZitadelUserResendVerifyCodeByPhonePostDto} dto - The DTO containing the resend verification code information.
   * @returns {Promise<ZitadelUserResendVerifyCodeByPhonePostResponse>} A promise that resolves to the response containing the resent verification code details.
   * @throws {Error} Thrown if the request fails.
   */
  async resendPhoneVerificationCode(
    userId: string,
    dto: ZitadelUserResendVerifyCodeByPhonePostDto,
  ): Promise<ZitadelUserResendVerifyCodeByPhonePostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/phone/resend`

    const response: ZitadelUserResendVerifyCodeByPhonePostResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Retrieves the authentication methods of a user.
   *
   * List all possible authentication methods of a user like password, passwordless, (T)OTP and more..
   *
   * You can filter the results by providing a domain parameters.
   *
   * @param {string} userId - The ID of the user to retrieve the authentication methods for.
   * @param {ZitadelUserAuthenticationMethodsGetQueryDto} dto - The DTO containing the query parameters.
   * @returns {Promise<ZitadelUserAuthenticationMethodsGetResponse>} A promise that resolves to the list of authentication methods.
   * @throws {Error} Thrown if the request fails.
   */
  async getAuthMethods(
    userId: string,
    dto: ZitadelUserAuthenticationMethodsGetQueryDto,
  ): Promise<ZitadelUserAuthenticationMethodsGetResponse> {
    const queryParams: { [key: string]: string } = {}

    if (dto.includeWithoutDomain) {
      queryParams['domainQuery.includeWithoutDomain'] = dto.includeWithoutDomain.toString()
    }

    if (dto.domain) {
      queryParams['domainQuery.domain'] = dto.domain
    }

    const queryParamString = new URLSearchParams(queryParams).toString()

    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/authentication_methods${queryParamString ? `?${queryParamString}` : ''}`

    const response: ZitadelUserAuthenticationMethodsGetResponse = await this.httpClient.client.get(url).json()

    return response
  }

  /**
   * Retrieves the permissions of a user.
   *
   * Show all the permissions the user has in ZITADEL (ZITADEL Manager).
   *
   * @param {string} userId - The ID of the user whose permissions are to be retrieved.
   * @param {ZitadelUserPermissionsGetDto} dto - The query parameters for the permission search.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserPermissionsGetResponseDto>} A promise that resolves to the response containing the user permissions.
   * @throws {Error} Thrown if the request fails.
   */
  async getPermissions(
    userId: string,
    dto: ZitadelUserPermissionsGetDto,
    orgId?: string,
  ): Promise<ZitadelUserPermissionsGetResponseDto> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/memberships/_search`

    const response: ZitadelUserPermissionsGetResponseDto = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

    return response
  }
}
