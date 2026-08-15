import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PlayerModule } from '../player/player.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    PlayerModule,
    JwtModule.register({
      global: true,
      secret: 'secreto',
      signOptions: {
        expiresIn: '120s',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
