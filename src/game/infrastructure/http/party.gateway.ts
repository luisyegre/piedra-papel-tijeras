import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PartyService } from 'src/game/application/party.service';
@WebSocketGateway({ namespace: 'party' })
export class PartyGateway {
  constructor(private partyService: PartyService) {}
  // async handleConnection(client: Socket) {}
  @SubscribeMessage('join')
  async joinParty(
    client: Socket,
    @MessageBody()
    data: {
      partyCode: string;
      username: string;
    },
  ): Promise<void> {
    await this.partyService.addUserToParty(data.username, data.partyCode);
    client.join(data.partyCode);
  }
  @SubscribeMessage('leave')
  async leaveParty(
    client: Socket,
    @MessageBody() data: { partyCode: string; id: string },
  ): Promise<void> {
    await this.partyService.removeUserFromParty(data.id, data.partyCode);
    client.leave(data.partyCode);
  }
  @SubscribeMessage('resumen')
  async sendResumen(@MessageBody('partyCode') partyCode: string) {
    const resumen = await this.partyService.getPartyResumen(partyCode);
    return resumen;
  }
}
