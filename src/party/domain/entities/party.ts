import { Player } from '../../../player/domain/player.entity';
import { Round, RoundResult } from './round';

export abstract class Party {
  private players: Player[] = [];
  private playing: boolean = false;
  protected playedRounds: Round[] = [];
  constructor(
    readonly id: string,
    private master: Player,
    private readonly code: string,
    // protected maxRounds: number,
  ) {}
  add(player: Player): void {
    if (this.playing) {
      throw new Error('Game is already started');
    }
    // if (this.players.find((p) => p.getUsername() === player.getUsername())) {
    //   throw new Error('Player with this username already exists');
    // }
    this.players.push(player);
  }
  remove(player: Player): void {
    this.players = this.players.filter((p) => p.id !== player.id);
  }
  start(): void {
    if (this.playing) {
      throw new Error('Game is already started');
    }
    if (this.players.length < 2) {
      throw new Error('Not enough players to start the game');
    }
    if (this.players.some((player) => !player.status.isReady())) {
      throw new Error('Not all players are ready');
    }
    this.playing = true;
  }
  isPlaying(): boolean {
    return this.playing;
  }
  getPlayers() {
    return this.players;
  }
  getMaster(): Player {
    return this.master;
  }
  abstract playRound(choices: Round): RoundResult;
  abstract getWinner(): Player | null;
}

export class EliminationParty extends Party {
  getWinner(): Player | null {
    const winners =
      this.playedRounds[this.playedRounds.length - 1]?.result().winners;
    return winners.length === 1 ? winners[0] : null;
  }
  playRound(round: Round): RoundResult {
    if (!this.isPlaying()) {
      throw new Error('Game is not started');
    }
    if (this.getWinner() !== null) {
      throw new Error('Game have a winner');
    }
    for (const player of this.getPlayers()) {
      if (player.status.isChoosing()) {
        throw new Error('Not all players have played');
      }
    }
    const result = round.result();
    this.playedRounds.push(round);
    return result;
  }
}