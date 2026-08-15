export class PlayerStatus {
  private status: 'LOOSE' | 'PLAYING' | 'CHOOSING' | 'READY' | 'NOT_READY' =
    'CHOOSING';
  ready(): void {
    this.status = 'READY';
  }
  notReady(): void {
    this.status = 'NOT_READY';
  }
  loose(): void {
    this.status = 'LOOSE';
  }
  play(): void {
    this.status = 'PLAYING';
  }
  choosing(): void {
    this.status = 'CHOOSING';
  }
  isLoose(): boolean {
    return this.status === 'LOOSE';
  }
  isPlaying(): boolean {
    return this.status === 'PLAYING';
  }
  isChoosing(): boolean {
    return this.status === 'CHOOSING';
  }
  isReady(): boolean {
    return this.status === 'READY';
  }
}
