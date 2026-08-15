import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PartyService } from '../../../application/party.service';
import type { AuthenticatedSocket } from '../authenticated-socket';

@Injectable()
export class WsRequiredBeMasterGuard implements CanActivate {
  constructor(private partyService: PartyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient<AuthenticatedSocket>();
    if (!client.data.partyCode || !client.data.username) {
      throw new WsException('Data not provided');
    }
    try {
      await this.partyService.verifyMaster(
        client.data.username,
        client.data.partyCode,
      );
    } catch (error) {
      throw new WsException((error as Error).message);
    }
    return true;
  }
}