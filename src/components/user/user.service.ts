import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { DelResult, DisplayInput, ReturnStatus } from './dto/user.dto';
import { User } from '../../db/models/user.entity';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './dto/user.dto';
import { validate, registerSchema, loginSchema } from '../../validation';
//import generateToken from 'src/utils/jwt';
import { sendMail } from 'src/utils/mail';
import { APP_HOSTNAME } from 'src/config';
import { JwtService } from '@nestjs/jwt';

import { hash, compare, genSalt } from 'bcryptjs';
import { createHash, timingSafeEqual } from 'crypto';
import { EMAIL_VERIFICATION_TIMEOUT, CLIENT_ORIGIN, PASSWORD_RESET_TIMEOUT } from '../../config';
import { hashedToken, signVerificationUrl } from '../../utils/utils';
import { Role } from 'src/db/models/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['roles'] });
  }

  async authUser(listUserInput: ListUserInput): Promise<User> {
    await validate(loginSchema, listUserInput);

    const { email, password } = listUserInput;

    const user = await this.userRepository.findOne({ email });

    if (!user || !(await this.matchesPassword(password, user))) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Incorrect email or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async getUserProfile(listUserInput: ListUserInput): Promise<User> {
    const { id } = listUserInput;
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Incorrect email or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async create(createUserDto: CreateUserInput): Promise<User> {
    const { email, name, password } = createUserDto;
    try {
      await validate(registerSchema, createUserDto);
      const found = await this.userRepository.findOne({ email });

      if (found) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'User already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let user = this.userRepository.create({ email, name, password });
      user = await this.preSave(user);

      const response = await this.userRepository.save(user);
      //console.log(user);
      if (response) {
        const link = this.verificationUrl(user);
        await sendMail({
          to: email,
          subject: 'Verify your email address',
          html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${link}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${APP_HOSTNAME}</p>
            `,
        });
        return user;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Invalid user data',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: err,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(updateUserDto: UpdateUserInput): Promise<User> {
    await this.userRepository.update(updateUserDto.id, {
      name: updateUserDto.name,
      email: updateUserDto.email,
    });

    const user = await this.userRepository.findOne({ id: updateUserDto.id });
    return user;
  }

  async delete(id: number): Promise<DelResult> {
    const del = await this.userRepository.delete(id);
    const res = new DelResult();
    res.affectedRows = del.affected;
    return res;
  }

  async deleteAll(): Promise<void> {
    return await this.userRepository.clear();
  }

  async addRoles(roles: DisplayInput[]): Promise<Role[]> {
    try {
      const rls = [];
      roles.forEach((rl) => {
        rls.push(this.roleRepository.create({ displayName: rl.displayName }));
      });
      const role = await this.roleRepository.save(rls);
      return role;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: err,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async addUserRoles(roles: ListUserInput[]): Promise<User> {
    try {
      let user = await this.userRepository.findOne({ id: roles[0].id });

      const rls = [];
      for (let i = 1; i < roles.length; i++) {
        const rl = await this.roleRepository.findOne({ id: roles[i].id });
        rls.push(rl);
      }

      user.roles = rls;
      console.log(user);
      user = await this.userRepository.save(user);
      return user;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: err,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  async login(user: User) {
    const payload = { id: user.id };
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: this.jwtService.sign(payload),
    };
  }

  preSave = async (user: User) => {
    const salt = await genSalt(10);
    //this.password = await hash(this.password, salt)
    user.password = await hash(user.password, salt);

    user.token = hashedToken(user.token as string);

    user.expiredAt = new Date(new Date().getTime() + Number(String(PASSWORD_RESET_TIMEOUT)));

    return user;
  };

  matchesPassword = (password: string, user: User) => {
    return compare(password, user.password);
  };

  verificationUrl = (user: User) => {
    const token = createHash('sha1').update(user.email).digest('hex');
    const expires = Date.now() + Number(String(EMAIL_VERIFICATION_TIMEOUT));

    const url = `${CLIENT_ORIGIN}/email/verify/${user.id}/${token}/${expires}`;
    const signature = signVerificationUrl(url);

    return `${url}/${signature}`;
  };

  url = (plaintextToken: string, id: string) => {
    return `${CLIENT_ORIGIN}/reset/${id}/${plaintextToken}`;
  };

  isValid = (plaintextToken: string, token: string, expiredAt: Date) => {
    const hash = hashedToken(plaintextToken);

    return (
      timingSafeEqual(Buffer.from(hash), Buffer.from(token as string)) &&
      (expiredAt as Date) > new Date()
    );
  };
}
