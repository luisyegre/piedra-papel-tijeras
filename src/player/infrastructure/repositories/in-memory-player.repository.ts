import { Injectable } from '@nestjs/common';
import { Player } from '../../domain/player.entity';
import { PlayerRepository } from '../../domain/player.repository';

@Injectable()
export class InMemoryPlayerRepository implements PlayerRepository {
  private readonly players: Map<string, Player> = new Map();

  async save(player: Player): Promise<void> {
    this.players.set(player.id, player);
  }

  async findByUsername(username: string): Promise<Player | null> {
    for (const player of this.players.values()) {
      if (player.getUsername() === username) {
        return player;
      }
    }
    return null;
  }

  async findById(id: string): Promise<Player | null> {
    return this.players.get(id) ?? null;
  }
}