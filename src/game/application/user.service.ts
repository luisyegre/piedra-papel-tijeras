import { Inject, Injectable } from '@nestjs/common';
import { Player } from '../domain/entities/player';
import type { PlayerRepository } from '../domain/repositories/player.repository';
import { PLAYER_REPOSITORY } from '../domain/tokens';

@Injectable()
export class UserService {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private playerRepository: PlayerRepository,
  ) {}
  async createPlayer(username: string): Promise<Player> {
    const player = new Player(crypto.randomUUID(), username);
    await this.playerRepository.save(player);
    return player;
  }
  async getPlayerByUsername(username: string): Promise<Player> {
    const player = await this.playerRepository.findByUsername(username);
    if (!player) {
      throw new Error('Player not found');
    }
    return player;
  }
}
