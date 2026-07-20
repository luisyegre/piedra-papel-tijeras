import { Party } from '../entities/party';

export interface PartyRepository {
  save(party: Party): Promise<void>;
  findById(id: string): Promise<Party | null>;
  findByCode(code: string): Promise<Party | null>;
}
