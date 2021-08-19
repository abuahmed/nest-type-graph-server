import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { User } from '../../db/models/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JWT_SECRET } from 'src/config';
import { Role } from 'src/db/models/role.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '30d', algorithm: 'HS256' },
    }),
  ],
  providers: [UserResolver, UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
