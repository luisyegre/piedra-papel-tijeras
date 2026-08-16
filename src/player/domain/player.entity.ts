import { PlayerStatus } from './player-status';

export class Player {
  private wins: number = 0;
  private looses: number = 0;
  readonly status: PlayerStatus = new PlayerStatus();
  constructor(
    readonly id: string,
    readonly username: string,
    private readonly password: string,
    private _isMaster: boolean = false,
  ) {}

  getScore() {
    return { wins: this.wins, looses: this.looses };
  }
  getUsername(): string {
    return this.username;
  }
  get isMaster() {
    return this._isMaster;
  }
  becomeMaster() {
    this._isMaster = true;
  }
  verifyPassword(password: string) {
    if (this.password !== password) {
      throw new Error('Password invalid');
    }
  }
}
