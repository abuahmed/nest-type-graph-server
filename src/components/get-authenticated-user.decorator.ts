// import { SetMetadata } from '@nestjs/common';

// export const GetUser = (...args: string[]) => SetMetadata('get-user', args);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from '../db/models/user.entity';

export const GetAuthenticatedUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = GqlExecutionContext.create(ctx).getContext().req.user;
  return req;
});
