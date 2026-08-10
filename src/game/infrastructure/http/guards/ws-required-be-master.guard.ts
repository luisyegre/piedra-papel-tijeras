import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PartyService } from 'src/game/application/party.service';

@Injectable()
export class WsRequiredBeMasterGuard implements CanActivate {
  constructor(private partyService: PartyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsContext = context.switchToWs();
    const data = wsContext.getData<{ masterId: string; partyCode: string }>();
    if (!data || !data.masterId || !data.partyCode) {
      throw new WsException('Master ID and Party Code are required');
    }
    try {
      await this.partyService.verifyMaster(data.masterId, data.partyCode);
    } catch (error) {
      throw new WsException((error as Error).message);
    }
    return true;
  }
}
