import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ReturnStatus } from './dto/user.dto';
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async authUser(listUserInput: ListUserInput): Promise<User> {
    //await validate(loginSchema, listUserInput);

    const { email, password } = listUserInput;

    const user = await this.usersRepository.findOne({ email });

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
    // const userData = new ReturnUser();
    // userData._id = user._id;
    // userData.name = user.name;
    // userData.email = user.email;
    // userData.isAdmin = user.isAdmin;
    // userData.token = generateToken(user._id);
    // return userData;
  }

  async getUserProfile(listUserInput: ListUserInput): Promise<User> {
    const { id } = listUserInput;
    const user = await this.usersRepository.findOne({ id });
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
      //await validate(registerSchema, createUserDto);
      const found = await this.usersRepository.findOne({ email });

      if (found) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'User already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
        //throw new BadRequest('User already exists')
      }

      // let user = new User();
      // user.email = email;
      // user.name = name;
      // user.password = password;

      let user = await this.usersRepository.create({ email, name, password });
      user = await this.preSave(user);

      const response = await this.usersRepository.save(user);
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
        // const status = new ReturnStatus();
        // status.message = `Email has been sent to ${email}. Follow the instruction to activate your account`;
        // return status;
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
          error: err,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(updateUserDto: UpdateUserInput): Promise<UpdateResult> {
    return this.usersRepository.update(updateUserDto.id, updateUserDto);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  async deleteAll(): Promise<void> {
    // const deletedCount = await this.usersRepository.count;
    return await this.usersRepository.clear();
    //return deletedCount;
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
