export interface SocketEvent {
  action: string
}
export interface TokenInfo {
  info: User
  permissions: string[]
}
export interface User {
  id: number
  firstName: string
  lastName: string
  firstKana: string
  lastKana: string
  tel: string
  status: 'init' | 'active' | 'deleted'
}
