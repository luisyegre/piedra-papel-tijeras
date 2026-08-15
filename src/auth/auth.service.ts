import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlayerService } from 'src/player/application/player.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private playerService: PlayerService,
  ) {}
  async signIn(username: string, password: string) {
    try {
      const player = await this.playerService.validateCredentials(
        username,
        password,
      );
      return {
        accessToken: await this.jwtService.signAsync({
          sub: player.id,
          username,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException((error as Error).message);
    }
  }
}
