import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/game/application/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('new-player')
  createPlayer(@Body() { username }: { username: string }) {
    return this.userService.createPlayer(username);
  }
}
