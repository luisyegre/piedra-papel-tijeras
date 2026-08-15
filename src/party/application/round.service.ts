import { Inject, Injectable } from '@nestjs/common';
import { Round } from '../domain/entities/round';
import { PLAYER_REPOSITORY } from '../../player/domain/tokens';
import { type PlayerRepository } from '../../player/domain/player.repository';
import { Choose } from '../domain/entities/choose';

@Injectable()
export class RoundService {
  private rounds: Map<string, Round> = new Map();
  constructor(
    @Inject(PLAYER_REPOSITORY) private playerRepository: PlayerRepository,
  ) {}

  createRound(partyId: string): Round {
    const round = new Round(partyId);
    this.rounds.set(partyId, round);
    return round;
  }

  async play(
    roundId: string,
    playerId: string,
    choice: string,
  ): Promise<Round> {
    const round = this.rounds.get(roundId);
    if (!round) {
      throw new Error('Round not found');
    }
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    if (!player.status.isLoose()) {
      throw new Error('Player is loose and cannot play');
    }
    const playerChoice = new Choose(choice, player);
    round.play(playerChoice);
    this.rounds.set(roundId, round);
    return round;
  }
}