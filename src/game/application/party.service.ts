import { Inject, Injectable } from '@nestjs/common';
import { Player } from '../domain/entities/player';
import type { PartyRepository } from '../domain/repositories/party.repository';
import type { PlayerRepository } from '../domain/repositories/player.repository';
import { EliminationParty, Party } from '../domain/entities/party';
import { PLAYER_REPOSITORY, PARTY_REPOSITORY } from '../domain/repositories/tokens';

@Injectable()
export class PartyService {
  constructor(
    @Inject('PLAYER_REPOSITORY')
    private playerRepository: PlayerRepository,
    @Inject('PARTY_REPOSITORY')
    private partyRepository: PartyRepository,
  ) {}
  async removeUserFromParty(userId: string, partyCode: string) {
    const party = await this.partyRepository.findByCode(partyCode);
    if (party === null) {
      throw new Error('Party not found');
    }
    const player = await this.playerRepository.findById(userId);
    if (player === null) {
      throw new Error('Player not found');
    }
    party.remove(player);
    await this.partyRepository.save(party);
  }
  async addUserToParty(username: string, partyCode: string): Promise<void> {
    const party = await this.partyRepository.findByCode(partyCode);
    if (party === null) {
      throw new Error('Party not found');
    }
    const user = new Player(crypto.randomUUID(), username);
    party.add(user);
    await this.partyRepository.save(party);
  }
  async createParty(masterId: string): Promise<Party> {
    const master = await this.playerRepository.findById(masterId);
    if (master === null) {
      throw new Error('Master player not found');
    }
    const party = new EliminationParty(
      crypto.randomUUID(),
      master,
      this.generatePartyCode(),
    );
    await this.partyRepository.save(party);
    return party;
  }
  async getPartyResumen(partyCode: string) {
    const party = await this.partyRepository.findByCode(partyCode);
    if (party === null) {
      throw new Error('Party not found');
    }
    return {
      id: party.id,
      players: party.getPlayers(),
    };
  }
  private generatePartyCode(): string {
    return `${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`;
  }
}
