import { Body, Controller, Post } from '@nestjs/common';
import { PlayerService } from '../../application/player.service';

@Controller('player')
export class UserController {
  constructor(private playerService: PlayerService) {}
  @Post('/new')
  async createPlayer(
    @Body() { username, password }: { username: string; password: string },
  ) {
    const result = await this.playerService.createPlayer(username, password);
    return result;
  }
}
