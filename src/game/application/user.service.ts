import { Injectable } from '@nestjs/common';
import { Player } from '../domain/entities/player';
import type { PlayerRepository } from '../domain/repositories/player.repository';

@Injectable()
export class UserService {
  constructor(private playerRepository: PlayerRepository) {}
  async createPlayer(username: string): Promise<Player> {
    const player = new Player(crypto.randomUUID(), username);
    await this.playerRepository.save(player);
    return player;
  }
}
