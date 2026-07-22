import { Body, Controller, Post } from '@nestjs/common';
import { PartyService } from 'src/game/application/party.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UserService } from 'src/game/application/user.service';

@Controller('party')
export class PartyController {
  constructor(
    private partyService: PartyService,
    private userService: UserService,
  ) {}
  @Post('create')
  async create(@Body() createPartyDto: CreatePartyDto) {
    const master = await this.userService.createPlayer(
      createPartyDto.masterUsername,
    );
    return this.partyService.createParty(master.id);
  }
}
