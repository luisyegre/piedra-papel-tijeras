import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { PartyService } from '../../application/party.service';
import { RoundService } from '../../application/round.service';
import { WsRequiredBeMasterGuard } from './guards/ws-required-be-master.guard';
import { UseGuards } from '@nestjs/common';
import type { AuthenticatedSocket } from './authenticated-socket';
import { Namespace } from 'socket.io';
import { PlayerService } from 'src/player/application/player.service';
@WebSocketGateway({ namespace: 'party', cors: true })
export class PartyGateway {
  @WebSocketServer()
  private namespace: Namespace;
  constructor(
    private partyService: PartyService,
    private playerService: PlayerService,
    private roundService: RoundService,
  ) {}
  async handleConnection(client: AuthenticatedSocket) {
    const { partyCode, username } = client.handshake.query;
    if (!partyCode || !username) {
      client.emit('error', { message: 'Faltan parámetros requeridos' });
      client.disconnect();
      return;
    }
    try {
      const isMember = await this.partyService.isPlayerInParty(
        username as string,
        partyCode as string,
      );
      if (!isMember) {
        throw new WsException('User is not part of the party');
      }
      client.data.partyCode = partyCode as string;
      client.data.username = username as string;
      await client.join(client.data.partyCode);
      this.namespace
        .to(client.data.partyCode)
        .emit('player.join', { username: client.data.username });
    } catch (error) {
      client.emit('error', { message: (error as Error).message });
      client.disconnect();
    }
  }
  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('close')
  async closeParty(@ConnectedSocket() client: AuthenticatedSocket) {
    await this.partyService.closeParty(client.data.partyCode);
    console.log('closing...');
    client.to(client.data.partyCode).emit('party.closed', { ok: true });
    client.disconnect();
  }

  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('kickOut')
  async kickOutUser(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { target: string },
  ) {
    await this.partyService.removeUserFromParty(
      data.target,
      client.data.partyCode,
    );
    client
      .to(client.data.partyCode)
      .emit('user.kickedOut', { username: data.target });
  }
  @SubscribeMessage('leave')
  async leaveParty(@ConnectedSocket() client: AuthenticatedSocket) {
    await this.partyService.removeUserFromParty(
      client.data.username,
      client.data.partyCode,
    );
    console.log('leaving');
    client
      .to(client.data.partyCode)
      .emit('player.leave', { username: client.data.username });
    client.disconnect();
  }
  @SubscribeMessage('ready')
  async setReady(@ConnectedSocket() client: AuthenticatedSocket) {
    await this.playerService.setPlayerReady(client.data.username);
    client
      .in(client.data.partyCode)
      .emit('player.ready', { username: client.data.username });
  }
  @SubscribeMessage('resumen')
  async sendResumen(@ConnectedSocket() client: AuthenticatedSocket) {
    const resumen = await this.partyService.getPartyResumen(
      client.data.partyCode,
    );
    return resumen;
  }

  //game
  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('start')
  async startGame(@ConnectedSocket() client: AuthenticatedSocket) {
    await this.partyService.startGame(client.data.partyCode);
    return { ok: true };
  }

  @SubscribeMessage('sendChoice')
  async playRound(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    roundData: {
      roundId: string;
      playerId: string;
      choice: string;
    },
  ) {
    const round = await this.roundService.play(
      roundData.roundId,
      roundData.playerId,
      roundData.choice,
    );
    await this.partyService.playRound(client.data.partyCode, round);
    client.to(client.data.partyCode).emit('round.played', { ok: true });
  }
}
