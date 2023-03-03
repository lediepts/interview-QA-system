import { ThunkDispatch } from '@reduxjs/toolkit'
import { SocketEvent, TokenInfo } from 'interfaces'
import { Socket } from 'socket.io-client'

export function SocketClientIO(
  socket: Socket,
  tokenInfo: TokenInfo,
  dispatch: ThunkDispatch<any, any, any>
) {
  socket.on('connect', () => {
    // noticeIO
    socket.on('noticeIO', (event: SocketEvent) => {
      process.env.NODE_ENV === 'development' && console.log(event)
      switch (event.action) {
        case 'created':
          break
        case 'updated':
          break
        case 'deleted':
          break
        default:
          break
      }
    })
  })
}
