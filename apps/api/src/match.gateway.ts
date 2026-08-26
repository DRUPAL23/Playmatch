import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/matches', cors: { origin: '*' } })
export class MatchGateway {
  @WebSocketServer() server!: Server;
  emitMatch(matchId: string, event: string, payload: unknown) { this.server.to(`match:${matchId}`).emit(event, payload); }
}
