export class Player {
  private status: 'READY' | 'NOT_READY' = 'NOT_READY';
  private score: number = 0;
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
    this.status = 'READY';
  }
  notReady(): void {
    this.status = 'NOT_READY';
  }
  get isReady(): boolean {
    return this.status === 'READY';
  }
}
