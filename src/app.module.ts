import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { PartyModule } from './party/party.module';

@Module({
  imports: [AuthModule, PlayerModule, PartyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}