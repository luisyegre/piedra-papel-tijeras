import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PartyService } from '../../application/party.service';
import { PlayerService } from '../../../player/application/player.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth.interface';

@Controller('party')
export class PartyController {
  constructor(
    private partyService: PartyService,
    private playerService: PlayerService,
  ) {}
  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Req() { user }: Request & { user: AuthUser }) {
    const player = await this.playerService.getPlayerByUsername(user.username);
    return this.partyService.createParty(player.id);
  }
  @UseGuards(AuthGuard)
  @Post('join/:partyCode')
  async join(
    @Req() { user }: Request & { user: AuthUser },
    @Param('partyCode') partyCode: string,
  ) {
    const player = await this.playerService.getPlayerByUsername(user.username);
    await this.partyService.addUserToParty(player, partyCode);
  }
}
