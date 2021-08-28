import { Injectable } from '@nestjs/common';
import { User } from 'src/db/models/user.entity';
//import { UsersService } from '../users/users.service';
//import { UserResolver } from '../components/user/user.resolver';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<User> {
    console.log(username);
    return await this.userService.authUser({ email: username, password: pass });
  }
  async google(idToken: string): Promise<any> {
    return await this.userService.googleLogin({ idToken });
  }
  async facebook(userID: string, accessToken: string): Promise<any> {
    return await this.userService.facebookLogin({ userID, accessToken });
  }
}
