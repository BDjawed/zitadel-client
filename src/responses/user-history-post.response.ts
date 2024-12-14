export interface ZitadelUserHistoryEvent {
  changeDate: Date
  eventType: {
    key: string
    localizedMessage: string
  }
  sequence: string
  editorId: string
  editorDisplayName: string
  resourceOwnerId: string
  editorPreferredLoginName: string
  editorAvatarUrl: string
}

export interface ZitadelUserHistoryPostResponse {
  result: Array<ZitadelUserHistoryEvent>
}
