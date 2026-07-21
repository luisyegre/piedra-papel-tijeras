import { Player } from '../entities/player';

export interface PlayerRepository {
  save(player: Player): Promise<void>;
  findByUsername(username: string): Promise<Player | null>;
  findById(id: string): Promise<Player | null>;
}
