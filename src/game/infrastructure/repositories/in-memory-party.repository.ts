import { Injectable } from '@nestjs/common';
import { Party } from '../../domain/entities/party';
import { PartyRepository } from '../../domain/repositories/party.repository';

@Injectable()
export class InMemoryPartyRepository implements PartyRepository {
  private readonly parties: Map<string, Party> = new Map();
  private readonly byCode: Map<string, Party> = new Map();

  save(party: Party): Promise<void> {
    this.parties.set(party.id, party);
    this.byCode.set(party['code'], party);
    return Promise.resolve();
  }

  findById(id: string): Promise<Party | null> {
    return Promise.resolve(this.parties.get(id) ?? null);
  }

  findByCode(code: string): Promise<Party | null> {
    return Promise.resolve(this.byCode.get(code) ?? null);
  }
  delete(party: Party): Promise<void> {
    this.parties.delete(party.id);
    this.byCode.delete(party['code']);
    return Promise.resolve();
  }
}
