import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { GetAuthenticatedUser } from '../get-authenticated-user.decorator';
import {
  CreateUserInput,
  DelResult,
  DisplayInput,
  ListUserInput,
  UpdateUserInput,
} from './dto/user.dto';
import { User } from '../../db/models/user.entity';
import { UserService } from './user.service';
import { DeleteResult } from 'typeorm';
import { Role } from 'src/db/models/role.entity';

@Resolver()
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  //Query
  @Query(() => [User])
  async Users() {
    return this._userService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Args('input') input: ListUserInput) {
    return this._userService.getUserProfile(input);
  }
  //Mutations
  @Mutation(() => User)
  @UseGuards(LocalAuthGuard)
  async authUser(@Args('input') input: ListUserInput, @GetAuthenticatedUser() user: User) {
    return this._userService.login(user);
  }
  @Mutation(() => User)
  async register(@Args('input') input: CreateUserInput) {
    return this._userService.create(input);
  }
  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput) {
    return this._userService.update(input);
  }

  @Mutation(() => DelResult)
  async deleteUser(@Args('id') id: number) {
    return this._userService.delete(id);
  }

  @Mutation(() => [Role])
  async addRoles(
    @Args({ name: 'input', type: () => [DisplayInput] }) input: DisplayInput[],
  ): Promise<Array<Role>> {
    return this._userService.addRoles(input);
  }

  @Mutation(() => Number)
  async deleteAll() {
    return this._userService.deleteAll();
  }
}
