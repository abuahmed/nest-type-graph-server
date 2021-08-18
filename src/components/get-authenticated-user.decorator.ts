// import { SetMetadata } from '@nestjs/common';

// export const GetUser = (...args: string[]) => SetMetadata('get-user', args);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../db/models/user.entity';

export const GetAuthenticatedUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
