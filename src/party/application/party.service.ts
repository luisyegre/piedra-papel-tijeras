import { Inject, Injectable } from '@nestjs/common';
import { Player } from '../../player/domain/player.entity';
import type { PartyRepository } from '../domain/repositories/party.repository';
import type { PlayerRepository } from '../../player/domain/player.repository';
import { EliminationParty, Party } from '../domain/entities/party';
import { PARTY_REPOSITORY } from '../domain/tokens';
import { PLAYER_REPOSITORY } from '../../player/domain/tokens';
import { Round } from '../domain/entities/round';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class PartyService {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private playerRepository: PlayerRepository,
    @Inject(PARTY_REPOSITORY)
    private partyRepository: PartyRepository,
  ) {}
  async removeUserFromParty(username: string, partyCode: string) {
    const party = await this.getPartyByCode(partyCode);
    const player = await this.playerRepository.findByUsername(username);
    if (!player) {
      throw new Error('Player not found');
    }
    party.remove(player);
    await this.partyRepository.save(party);
  }
  async addUserToParty(player: Player, partyCode: string): Promise<void> {
    const party = await this.getPartyByCode(partyCode);
    party.add(player);
    await this.partyRepository.save(party);
  }
  async createParty(masterId: string): Promise<Party> {
    const creator = await this.getPlayerById(masterId);
    const party = new EliminationParty(
      crypto.randomUUID(),
      this.generatePartyCode(),
    );
    party.setMaster(creator);
    creator.becomeMaster();
    await this.partyRepository.save(party);
    await this.playerRepository.save(creator);
    return party;
  }
  async getPartyResumen(partyCode: string) {
    const party = await this.getPartyByCode(partyCode);
    return {
      id: party.id,
      master: party.getMaster(),
      players: party.getPlayers(),
    };
  }
  async startGame(partyCode: string) {
    try {
      const party = await this.getPartyByCode(partyCode);
      party.start();
      await this.partyRepository.save(party);
    } catch (error) {
      throw new WsException((error as Error).message);
    }
  }
  async playRound(partyCode: string, round: Round): Promise<void> {
    const party = await this.getPartyByCode(partyCode);
    party.playRound(round);
  }
  async closeParty(partyCode: string): Promise<void> {
    const party = await this.getPartyByCode(partyCode);
    await this.partyRepository.delete(party);
    //despues de 10 minutos borrar todos los usuarios de la party.
  }
  async verifyMaster(username: string, partyCode: string): Promise<void> {
    const party = await this.getPartyByCode(partyCode);
    const partyMaster = party.getMaster();
    if (partyMaster.getUsername() !== username) {
      throw new Error('Only the master can perform this action');
    }
  }
  async isPlayerInParty(username: string, partyCode: string): Promise<boolean> {
    const party = await this.getPartyByCode(partyCode);
    return (
      party.getMaster().getUsername() === username ||
      party.getPlayers().some((p) => p.getUsername() === username)
    );
  }
  private async getPartyByCode(partyCode: string): Promise<Party> {
    const party = await this.partyRepository.findByCode(partyCode);
    if (!party) {
      throw new Error('Party not found');
    }
    return party;
  }
  private async getPlayerById(playerId: string): Promise<Player> {
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    return player;
  }
  private generatePartyCode(): string {
    return `${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`;
  }
}