import { Injectable } from '@nestjs/common';
//import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { loginSchema, validate } from 'src/validation';
//import { UserResolver } from '../components/user/user.resolver';
import { UserDocument } from '../user/entities/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return await this.userService.authUser({ email: username, password: pass });
    // // const user = await this.usersService.findOne(username);
    // // if (user && user.password === pass) {
    // //   const { password, ...result } = user;
    // //   return result;
    // // }
    // return null;

    // const listUserInput = { email: username, password: pass };
    // await validate(loginSchema, listUserInput);

    // const { email, password } = listUserInput;

    // const user = await this.UserModel.findOne({ email });

    // if (!user || !(await user.matchesPassword(password))) {
    //   return null;
    // }
    // return user;
  }

  // async login(user: UserDocument) {
  //   const payload = { id: user._id };
  //   return {
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin: user.isAdmin,
  //     token: this.jwtService.sign(payload),
  //   };
  // }
}
