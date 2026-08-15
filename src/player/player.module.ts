import { Module } from '@nestjs/common';
import { PlayerService } from './application/player.service';
import { UserController } from './infrastructure/http/player.controller';
import { InMemoryPlayerRepository } from './infrastructure/repositories/in-memory-player.repository';
import { PLAYER_REPOSITORY } from './domain/tokens';

@Module({
  controllers: [UserController],
  providers: [
    PlayerService,
    InMemoryPlayerRepository,
    {
      provide: PLAYER_REPOSITORY,
      useExisting: InMemoryPlayerRepository,
    },
  ],
  exports: [PlayerService, PLAYER_REPOSITORY],
})
export class PlayerModule {}
