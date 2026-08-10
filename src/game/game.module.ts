import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/http/player.controller';
import { PartyGateway } from './infrastructure/http/party.gateway';
import { PartyService } from './application/party.service';
import { UserService } from './application/user.service';
import { InMemoryPlayerRepository } from './infrastructure/repositories/in-memory-player.repository';
import { InMemoryPartyRepository } from './infrastructure/repositories/in-memory-party.repository';
import { PLAYER_REPOSITORY, PARTY_REPOSITORY } from './domain/tokens';
import { RoundService } from './application/round.service';
import { PartyController } from './infrastructure/http/party.controller';

@Module({
  controllers: [UserController, PartyController],
  providers: [
    PartyGateway,
    PartyService,
    UserService,
    InMemoryPlayerRepository,
    InMemoryPartyRepository,
    RoundService,
    {
      provide: PLAYER_REPOSITORY,
      useExisting: InMemoryPlayerRepository,
    },
    {
      provide: PARTY_REPOSITORY,
      useExisting: InMemoryPartyRepository,
    },
  ],
})
export class GameModule {}
