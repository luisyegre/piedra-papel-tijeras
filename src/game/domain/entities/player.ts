export class Player {
  private partyStatus: 'READY' | 'NOT_READY' = 'NOT_READY';
  private score: number = 0;
  private gameStatus: 'LOOSE' | 'PLAYING' | 'CHOOSING' = 'CHOOSING';
  constructor(
    readonly id: string,
    private readonly username: string,
  ) {}
  getScore(): number {
    return this.score;
  }
  getUsername(): string {
    return this.username;
  }
  ready(): void {
    this.partyStatus = 'READY';
  }
  notReady(): void {
    this.partyStatus = 'NOT_READY';
  }
  loose(): void {
    this.gameStatus = 'LOOSE';
  }
  play(): void {
    this.gameStatus = 'PLAYING';
  }
  choosing(): void {
    this.gameStatus = 'CHOOSING';
  }
  isReady(): boolean {
    return this.partyStatus === 'READY';
  }
  isLoose(): boolean {
    return this.gameStatus === 'LOOSE';
  }
  isPlaying(): boolean {
    return this.gameStatus === 'PLAYING';
  }
  isChoosing(): boolean {
    return this.gameStatus === 'CHOOSING';
  }
}
