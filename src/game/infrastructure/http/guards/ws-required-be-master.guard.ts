import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PartyService } from 'src/game/application/party.service';

@Injectable()
export class WsRequiredBeMasterGuard implements CanActivate {
  constructor(private partyService: PartyService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsContext = context.switchToWs();
    const data = wsContext.getData<{
      username: string;
      partyCode: string;
    }>();
    if (!data || !data.username || !data.partyCode) {
      throw new WsException('Data not provided');
    }
    try {
      await this.partyService.verifyMaster(data.username, data.partyCode);
    } catch (error) {
      throw new WsException((error as Error).message);
    }
    return true;
  }
}
