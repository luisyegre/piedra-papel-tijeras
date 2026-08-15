import { PlayerStatus } from './player-status';

export class Player {
  private wins: number = 0;
  private looses: number = 0;
  readonly status: PlayerStatus = new PlayerStatus();
  constructor(
    readonly id: string,
    readonly username: string,
    private readonly password: string,
  ) {}

  getScore() {
    return { wins: this.wins, looses: this.looses };
  }
  getUsername(): string {
    return this.username;
  }
  verifyPassword(password: string) {
    if (this.password !== password) {
      throw new Error('Password invalid');
    }
  }
}
