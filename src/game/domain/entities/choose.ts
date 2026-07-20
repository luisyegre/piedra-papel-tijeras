import { Player } from './player';

export class Choose {
  constructor(
    private readonly name: string,
    private readonly player: Player,
  ) {}

  getName(): string {
    return this.name;
  }
  getPlayer(): Player {
    return this.player;
  }
}
