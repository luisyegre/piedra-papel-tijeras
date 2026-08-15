import { Module } from '@nestjs/common';
import { PlayerModule } from '../player/player.module';
import { AuthModule } from '../auth/auth.module';
import { PartyController } from './infrastructure/http/party.controller';
import { PartyGateway } from './infrastructure/http/party.gateway';
import { PartyService } from './application/party.service';
import { RoundService } from './application/round.service';
import { InMemoryPartyRepository } from './infrastructure/repositories/in-memory-party.repository';
import { PARTY_REPOSITORY } from './domain/tokens';

@Module({
  imports: [PlayerModule, AuthModule],
  controllers: [PartyController],
  providers: [
    PartyGateway,
    PartyService,
    RoundService,
    InMemoryPartyRepository,
    {
      provide: PARTY_REPOSITORY,
      useExisting: InMemoryPartyRepository,
    },
  ],
})
export class PartyModule {}
