import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserPasswordResetCreateDto {
  sendLink: SendLink
  returnCode?: object
}

export interface SendLink {
  notificationType: NotificationType
  urlTemplate?: string
}

export enum NotificationType {
  UNSPECIFIED = 'NOTIFICATION_TYPE_Unspecified',
  EMAIL = 'NOTIFICATION_TYPE_EMAIL',
  SMS = 'NOTIFICATION_TYPE_SMS',
}

export interface ZitadelUserPasswordResetCreatePathDto extends ZitadelUserByIdGetPathDto {}
