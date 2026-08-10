import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PartyService } from 'src/game/application/party.service';
import { RoundService } from 'src/game/application/round.service';
import { UserService } from 'src/game/application/user.service';
import { WsRequiredBeMasterGuard } from './guards/ws-required-be-master.guard';
import { UseGuards } from '@nestjs/common';
@WebSocketGateway({ namespace: 'party' })
export class PartyGateway {
  constructor(
    private partyService: PartyService,
    private roundService: RoundService,
    private playerService: UserService,
  ) {}
  async handleConnection(client: Socket) {
    const partyCode = client.handshake.query.partyCode as string;
    const username = client.handshake.query.username as string;
    if (!partyCode || !username) {
      client.disconnect();
      return;
    }
    try {
      const player = await this.playerService.getPlayerByUsername(username);
      await this.partyService.addUserToParty(player, partyCode);
      await client.join(partyCode);
    } catch (error) {
      client.emit('error', { message: (error as Error).message });
      client.disconnect();
    }
  }
  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('close')
  async closeParty(
    client: Socket,
    @MessageBody('partyCode') partyCode: string,
  ) {
    await this.partyService.closeParty(partyCode);
    client.emit('party.closed', { ok: true });
    await client.leave(partyCode);
  }

  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('kickOut')
  async kickOutUser(
    client: Socket,
    @MessageBody('data')
    data: { partyCode: string; userId: string },
  ) {
    await this.partyService.removeUserFromParty(data.userId, data.partyCode);
    client.emit('user.kickedOut', { ok: true });
  }
  @SubscribeMessage('leave')
  async leaveParty(
    client: Socket,
    @MessageBody() data: { partyCode: string; userId: string },
  ): Promise<void> {
    await this.partyService.removeUserFromParty(data.userId, data.partyCode);
    await client.leave(data.partyCode);
  }
  @SubscribeMessage('resumen')
  async sendResumen(@MessageBody('partyCode') partyCode: string) {
    const resumen = await this.partyService.getPartyResumen(partyCode);
    return resumen;
  }

  //game
  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('start')
  async startGame(
    client: Socket,
    @MessageBody('partyData')
    partyData: {
      partyCode: string;
    },
  ) {
    await this.partyService.startGame(partyData.partyCode);
    client.emit('game.started', { ok: true });
  }

  @SubscribeMessage('sendChoice')
  async playRound(
    client: Socket,
    @MessageBody('roundData')
    roundData: {
      partyId: string;
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
    await this.partyService.playRound(roundData.partyId, round);
    client.emit('round.played', { ok: true });
  }
}
