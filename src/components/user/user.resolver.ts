import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateUserInput,
  DelResult,
  FacebookInput,
  ForgotAuth,
  GoogleInput,
  IdList,
  ListUserInput,
  ResetAuth,
  UpdatePassword,
  UpdateUserInput,
  VerifyAuth,
  VerifyResendAuth,
} from './dto/user.dto';
import { User } from '../../db/models/user.entity';
import { UserService } from './user.service';
import { Role } from 'src/db/models/role.entity';
import { UserArgs } from '../warehouse/dto/list.args';

@Resolver()
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  //Query
  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async Users(@Args() userArgs: UserArgs): Promise<Array<User>> {
    return await this._userService.findAll(userArgs);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async GetUser(@Args('input') input: ListUserInput): Promise<User> {
    return await this._userService.findUserById(input.id);
  }

  //Mutations
  @Mutation(() => User)
  async authUser(@Args('input') input: ListUserInput) {
    return await this._userService.authUser(input);
  }
  @Mutation(() => User)
  async googleLogin(@Args('input') input: GoogleInput) {
    return await this._userService.googleLogin(input);
  }
  @Mutation(() => User)
  async facebookLogin(@Args('input') input: FacebookInput) {
    return await this._userService.facebookLogin(input);
  }
  @Mutation(() => User)
  async register(@Args('input') input: CreateUserInput) {
    return await this._userService.signUpUser(input);
  }
  @Mutation(() => User)
  async registerFederatedUser(@Args('input') input: CreateUserInput) {
    return await this._userService.createUser(input);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async changePassword(@Args('input') input: UpdatePassword) {
    return await this._userService.changePassword(input);
  }
  @Mutation(() => User)
  async verifyEmail(@Args('input') input: VerifyAuth) {
    return await this._userService.verifyEmail(input);
  }
  @Mutation(() => User)
  async resendVerificationEmail(@Args('input') input: VerifyResendAuth) {
    return await this._userService.resendVerificationEmail(input);
  }
  @Mutation(() => User)
  async forgotPassword(@Args('input') input: ForgotAuth) {
    return await this._userService.forgotPassword(input);
  }
  @Mutation(() => User)
  async resetUserPassword(@Args('input') input: ResetAuth) {
    return await this._userService.resetUserPassword(input);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(@Args('input') input: UpdateUserInput) {
    return await this._userService.updateUserProfile(input);
  }
  @Mutation(() => DelResult)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Args('id') id: number) {
    return await this._userService.delete(id);
  }

  //@Args({ name: 'input', type: () => [DisplayInput] }) input: DisplayInput[],
  @Mutation(() => [Role])
  async addRoles(): Promise<Array<Role>> {
    return await this._userService.addRoles();
  }

  @Query(() => [Role])
  @UseGuards(JwtAuthGuard)
  async GetRoles(): Promise<Array<Role>> {
    return await this._userService.findAllRoles();
  }

  @Mutation(() => User)
  async addUserRoles(@Args({ name: 'input', type: () => IdList }) input: IdList): Promise<User> {
    return await this._userService.addUserRoles(input.ids);
  }

  @Mutation(() => User)
  async addUserWarehouses(
    @Args({ name: 'input', type: () => IdList }) input: IdList,
  ): Promise<User> {
    return await this._userService.addUserWarehouses(input.ids);
  }

  @Mutation(() => Number)
  @UseGuards(JwtAuthGuard)
  async deleteAll() {
    return await this._userService.deleteAll();
  }
}
