import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { DelResult, FacebookInput, GoogleInput } from './dto/user.dto';
import { User } from '../../db/models/user.entity';
import { CreateUserInput, ListUserInput, UpdateUserInput } from './dto/user.dto';
import {
  validate,
  registerSchema,
  loginSchema,
  registerFederatedUserSchema,
} from '../../validation';
//import generateToken from 'src/utils/jwt';
import { sendMail } from 'src/utils/mail';
import { APP_HOSTNAME } from 'src/config';
import { JwtService } from '@nestjs/jwt';

import { hash, compare, genSalt } from 'bcryptjs';
import { createHash, timingSafeEqual } from 'crypto';
import { EMAIL_VERIFICATION_TIMEOUT, CLIENT_ORIGIN, PASSWORD_RESET_TIMEOUT } from '../../config';
import { hashedToken, signVerificationUrl } from '../../utils/utils';
import { Role } from 'src/db/models/role.entity';
import { JwtDto } from '../auth/dto/jwt.dto';
import roles from 'src/data/roles';
import { Warehouse } from 'src/db/models/warehouse.entity';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['roles', 'warehouses', 'client'] });
  }

  async authUser(listUserInput: ListUserInput): Promise<User> {
    await validate(loginSchema, listUserInput);

    const { email, password } = listUserInput;

    const user = await this.userRepository.findOne({ email });

    if (!user || !(await this.matchesPassword(password, user))) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Incorrect email or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.login(user);
  }

  async getUserProfile(listUserInput: ListUserInput): Promise<User> {
    const { id } = listUserInput;
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Incorrect email or password',
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
            message: 'User already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let user = this.userRepository.create({ email, name, password });
      user = await this.preSave(user);

      const response = await this.userRepository.save(user);
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
            message: 'Invalid user data',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  async createFederatedUser(createUserDto: CreateUserInput): Promise<User> {
    const { email, clientId } = createUserDto;
    try {
      await validate(registerFederatedUserSchema, createUserDto);
      const found = await this.userRepository.findOne({ email });

      if (found) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'User already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const password = '123456';
      const name = email.substring(0, email.indexOf('@'));
      const user = this.userRepository.create({ email, clientId, name, password });

      const response = await this.userRepository.save(user);
      if (response) {
        return user;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'Invalid user data',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  googleLogin = async (googleInput: GoogleInput): Promise<User> => {
    try {
      const { idToken } = googleInput;

      const result: LoginTicket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = result.getPayload();
      const email_verified = payload?.email_verified;
      const name = payload?.name;
      const email = payload?.email;
      const avatar = payload?.picture;

      if (email_verified) {
        let user = await this.userRepository.findOne({ email });

        if (!user) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: 'User Not Found!',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        if (user) {
          const password = '123456';
          user = { ...user, name, password, avatar };
          if (user) user = await this.userRepository.save(user);
          if (user) return await this.login(user);
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'Email not Verified',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  };

  facebookLogin = async (facebookInput: FacebookInput): Promise<User> => {
    try {
      //console.log('FACEBOOK LOGIN REQ BODY', req.body);
      const { userID, accessToken } = facebookInput;

      const url = `https://graph.facebook.com/v10.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

      const response = await axios.get(url);
      const { email, name, picture } = response.data;

      const avatar = picture?.data?.url;

      let user = await this.userRepository.findOne({ email });

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'User Not Found!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user) {
        const password = '123456';
        user = { ...user, name, password, avatar };

        if (user) user = await this.userRepository.save(user);
        if (user) return await this.login(user);
      }
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  };

  async findUserById(userId: number) {
    //console.log('userId', userId);
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles', 'warehouses', 'client'],
    });
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

  async addRoles(): Promise<Role[]> {
    try {
      const rls = [];
      roles.forEach((rl) => {
        rls.push(this.roleRepository.create({ displayName: rl }));
      });
      const role = await this.roleRepository.save(rls);
      return role;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async findAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async addUserWarehouses(ids: [number]): Promise<User> {
    try {
      let user = await this.userRepository.findOne({ id: ids[0] });
      const warehouses: Warehouse[] = [];
      for (let i = 1; i < ids.length; i++) {
        const rl = await this.warehouseRepository.findOne({ id: ids[i] });
        warehouses.push(rl);
      }

      user.warehouses = warehouses;
      user = await this.userRepository.save(user);
      if (user) {
        return await this.userRepository.findOne({
          where: { id: user.id },
          relations: ['roles', 'warehouses', 'client'],
        });
      }
      //return user;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  async addUserRoles(roles: [number]): Promise<User> {
    try {
      let user = await this.userRepository.findOne({ id: roles[0] });
      const rls: Role[] = [];
      for (let i = 1; i < roles.length; i++) {
        const rl = await this.roleRepository.findOne({ id: roles[i] });
        rls.push(rl);
      }

      user.roles = rls;
      user = await this.userRepository.save(user);
      if (user) {
        return await this.userRepository.findOne({
          where: { id: user.id },
          relations: ['roles', 'warehouses', 'client'],
        });
      }
      //return user;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  async login(user: User): Promise<User> {
    const payload: JwtDto = { userId: user.id };

    const usr = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: ['roles', 'warehouses', 'client'],
    });
    usr.token = this.jwtService.sign(payload);
    return { ...usr };
  }

  preSave = async (user: User) => {
    const salt = await genSalt(10);
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
