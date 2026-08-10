import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
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
    //verificar token de sesion
  }
  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { partyCode, username }: { partyCode: string; username: string },
  ) {
    if (!partyCode || !username) {
      client.emit('error', {
        message: 'Faltan parámetros requeridos (partyCode o username)',
      });
    }
    try {
      const player = await this.playerService.getPlayerByUsername(username);
      await this.partyService.addUserToParty(player, partyCode);
      await client.join(partyCode);
    } catch (error) {
      throw new WsException((error as Error).message);
      // client.emit('error', { message: (error as Error).message });
    }
  }
  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('close')
  async closeParty(
    @ConnectedSocket() client: Socket,
    @MessageBody('partyCode') partyCode: string,
  ) {
    await this.partyService.closeParty(partyCode);
    client.emit('party.closed', { ok: true });
    await client.leave(partyCode);
  }

  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('kickOut')
  async kickOutUser(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { partyCode: string; target: string },
  ) {
    await this.partyService.removeUserFromParty(data.target, data.partyCode);
    client.emit('user.kickedOut', { ok: true });
  }
  @SubscribeMessage('leave')
  async leaveParty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { partyCode: string; username: string },
  ): Promise<void> {
    await this.partyService.removeUserFromParty(data.username, data.partyCode);
    await client.leave(data.partyCode);
  }
  @SubscribeMessage('resumen')
  async sendResumen(@MessageBody() partyCode: string) {
    const resumen = await this.partyService.getPartyResumen(partyCode);
    return resumen;
  }

  //game
  @UseGuards(WsRequiredBeMasterGuard)
  @SubscribeMessage('start')
  async startGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('partyCode') partyCode: string,
  ) {
    await this.partyService.startGame(partyCode);
    client.emit('game.started', { ok: true });
  }

  @SubscribeMessage('sendChoice')
  async playRound(
    @ConnectedSocket() client: Socket,
    @MessageBody()
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
