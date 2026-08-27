import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/matches', cors: { origin: '*' } })
export class MatchGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  handleConnection(client: Socket) { client.emit('connected', { namespace: 'matches' }); }

  @SubscribeMessage('match:join')
  join(client: Socket, matchId: string) { client.join(`match:${matchId}`); return { ok: true, matchId }; }

  @SubscribeMessage('match:leave')
  leave(client: Socket, matchId: string) { client.leave(`match:${matchId}`); return { ok: true, matchId }; }

  emitMatch(matchId: string, event: string, payload: unknown) { this.server.to(`match:${matchId}`).emit(event, payload); }
}
