import { Injectable } from '@nestjs/common';
import { Party } from '../../domain/entities/party';
import { PartyRepository } from '../../domain/repositories/party.repository';

@Injectable()
export class InMemoryPartyRepository implements PartyRepository {
  private readonly parties: Map<string, Party> = new Map();
  private readonly byCode: Map<string, Party> = new Map();

  async save(party: Party): Promise<void> {
    this.parties.set(party.id, party);
    this.byCode.set(party['code'], party);
  }

  async findById(id: string): Promise<Party | null> {
    return this.parties.get(id) ?? null;
  }

  async findByCode(code: string): Promise<Party | null> {
    return this.byCode.get(code) ?? null;
  }
}
