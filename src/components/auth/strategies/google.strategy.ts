import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(idToken: string): Promise<any> {
    const user = await this.authService.google(idToken);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
