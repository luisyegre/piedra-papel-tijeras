import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { PartyService } from 'src/game/application/party.service';

@WebSocketGateway({ namespace: 'party' })
export class PartyGateway {
  constructor(private partyService: PartyService) {}
  @SubscribeMessage('party:join')
  async handleJoin(
    @MessageBody() data: { partyCode: string; username: string },
  ): Promise<void> {
    await this.partyService.addUserToParty(data.username, data.partyCode);
  }
  @SubscribeMessage('party:leave')
  async handleLeave(
    @MessageBody() data: { partyCode: string; id: string },
  ): Promise<void> {
    await this.partyService.removeUserFromParty(data.id, data.partyCode);
  }
}
