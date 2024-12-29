export interface ZitadelMachineUserIdpsListGetResponse {
  details: {
    totalResult: string
    processedSequence: string
    timestamp: string
  }
  result: Idp[]
}

interface Idp {
  idpId: string
  userId: string
  userName: string
}
