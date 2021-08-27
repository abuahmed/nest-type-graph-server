import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { GetAuthenticatedUser } from '../get-authenticated-user.decorator';
import {
  CreateUserInput,
  DelResult,
  FacebookInput,
  GoogleInput,
  ListUserInput,
  UpdateUserInput,
} from './dto/user.dto';
import { User } from '../../db/models/user.entity';
import { UserService } from './user.service';
import { Role } from 'src/db/models/role.entity';
import { DisplayInput } from '../dto/display.input';
import { GoogleAuthGuard } from '../auth/guards/google-auth.guard';
import { FacebookAuthGuard } from '../auth/guards/facebook-auth.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  //Query
  @Query(() => [User])
  async Users(): Promise<Array<User>> {
    return await this._userService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Args('input') input: ListUserInput) {
    return await this._userService.getUserProfile(input);
  }
  //Mutations
  @Mutation(() => User)
  @UseGuards(LocalAuthGuard)
  async authUser(@Args('input') input: ListUserInput, @GetAuthenticatedUser() user: User) {
    return await this._userService.login(user);
  }
  @Mutation(() => User)
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Args('input') input: GoogleInput, @GetAuthenticatedUser() user: User) {
    return await this._userService.login(user);
  }
  @Mutation(() => User)
  @UseGuards(FacebookAuthGuard)
  async facebookLogin(@Args('input') input: FacebookInput, @GetAuthenticatedUser() user: User) {
    return await this._userService.login(user);
  }
  @Mutation(() => User)
  async register(@Args('input') input: CreateUserInput) {
    return await this._userService.create(input);
  }
  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput) {
    return await this._userService.update(input);
  }

  @Mutation(() => DelResult)
  async deleteUser(@Args('id') id: number) {
    return await this._userService.delete(id);
  }

  @Mutation(() => [Role])
  async addRoles(
    @Args({ name: 'input', type: () => [DisplayInput] }) input: DisplayInput[],
  ): Promise<Array<Role>> {
    return await this._userService.addRoles(input);
  }

  @Mutation(() => User)
  async addUserRoles(
    @Args({ name: 'input', type: () => [ListUserInput] }) input: ListUserInput[],
  ): Promise<User> {
    return await this._userService.addUserRoles(input);
  }

  @Mutation(() => Number)
  async deleteAll() {
    return await this._userService.deleteAll();
  }
}
