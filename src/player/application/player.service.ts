import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Player } from '../domain/player.entity';
import type { PlayerRepository } from '../domain/player.repository';
import { PLAYER_REPOSITORY } from '../domain/tokens';

@Injectable()
export class PlayerService {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private playerRepository: PlayerRepository,
  ) {}
  async createPlayer(username: string, password: string): Promise<Player> {
    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    const playerFound = await this.playerRepository.findByUsername(username);
    if (playerFound !== null) {
      throw new BadRequestException('Player already exist');
    }
    const player = new Player(crypto.randomUUID(), username, password);
    await this.playerRepository.save(player);
    return player;
  }
  async getPlayerByUsername(username: string): Promise<Player> {
    const player = await this.playerRepository.findByUsername(username);
    if (player === null) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }
  async validateCredentials(
    username: string,
    password: string,
  ): Promise<Player> {
    const player = await this.getPlayerByUsername(username);
    player.verifyPassword(password);
    return player;
  }
}
