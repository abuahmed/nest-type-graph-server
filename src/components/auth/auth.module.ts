import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JWT_SECRET } from 'src/config';
import { UserModule } from '../user/user.module';
import { LocalAuthGuard } from './guards/local-auth.guard';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '30d', algorithm: 'HS256' },
    }),
    UserModule,
  ],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
