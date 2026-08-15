import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { PartyService } from '../../application/party.service';
import { RoundService } from '../../application/round.service';
import { PlayerService } from '../../../player/application/player.service';
import { WsRequiredBeMasterGuard } from './guards/ws-required-be-master.guard';
import { UseGuards } from '@nestjs/common';
import type { AuthenticatedSocket } from './authenticated-socket';
@WebSocketGateway({ namespace: 'party' })
export class PartyGateway {
  constructor(
    private partyService: PartyService,
    private roundService: RoundService,
    private playerService: PlayerService,
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
    } catch (error) {
      client.emit('error', { message: (error as Error).message });
      client.disconnect();
    }
  }
  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('close')
  async closeParty(@ConnectedSocket() client: AuthenticatedSocket) {
    await this.partyService.closeParty(client.data.partyCode);
    client.emit('party.closed', { ok: true });
    await client.leave(client.data.partyCode);
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
    client.emit('user.kickedOut', { ok: true });
  }
  @SubscribeMessage('leave')
  async leaveParty(@ConnectedSocket() client: AuthenticatedSocket) {
    await this.partyService.removeUserFromParty(
      client.data.username,
      client.data.partyCode,
    );
    await client.leave(client.data.partyCode);
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
    client.emit('game.started', { ok: true });
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
    client.emit('round.played', { ok: true });
  }
}
