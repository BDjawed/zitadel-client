import { AuthService } from './core/auth-service'
import { HttpClient } from './core/http-client'
import { AppService } from './services/app/app.service'
import { OrganizationService } from './services/organization/organization.service'
import { PoliciesService } from './services/policies/policies.service'
import { ProjectService } from './services/project/project.service'
import { UserHumanService } from './services/user/human/user.human.service'
import { UserMachineService } from './services/user/machine/user.machine.service'
import { UserService } from './services/user/user.service'
import { generateAssertion } from './utils/jwt.utils'
import type { ZitadelClientOptions } from './interfaces'

export class ZitadelClient {
  private httpClient: HttpClient
  private authService: AuthService
  private organizationService: OrganizationService
  private userService: UserService
  private userHumanService: UserHumanService
  private userMachineService: UserMachineService
  private projectService: ProjectService
  private appService: AppService
  private policiesService: PoliciesService

  constructor(private options: ZitadelClientOptions) {
    this.httpClient = new HttpClient(options)
    this.authService = new AuthService(options, this.httpClient)
    this.organizationService = new OrganizationService(this.httpClient)
    this.userService = new UserService(this.httpClient)
    this.userHumanService = new UserHumanService(this.httpClient)
    this.userMachineService = new UserMachineService(this.httpClient)
    this.projectService = new ProjectService(this.httpClient)
    this.appService = new AppService(this.httpClient)
    this.policiesService = new PoliciesService(this.httpClient)
  }

  /**
   * Performs the initial setup for the client.
   *
   * This includes fetching the OpenID Connect well-known configuration
   * and authenticating the service user.
   * The setup must be called before any other method can be used.
   */
  async setup(): Promise<void> {
    await this.authService.setup()
  }

  get auth(): AuthService {
    return this.authService
  }

  get organization(): OrganizationService {
    return this.organizationService
  }

  get userHuman(): UserHumanService {
    return this.userHumanService
  }

  get user(): UserService {
    return this.userService
  }

  get userMachine(): UserMachineService {
    return this.userMachineService
  }

  get project(): ProjectService {
    return this.projectService
  }

  get app(): AppService {
    return this.appService
  }

  get policies(): PoliciesService {
    return this.policiesService
  }

  static generateJwtAssertion = generateAssertion
}
