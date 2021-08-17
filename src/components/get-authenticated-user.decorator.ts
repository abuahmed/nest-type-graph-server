// import { SetMetadata } from '@nestjs/common';

// export const GetUser = (...args: string[]) => SetMetadata('get-user', args);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User, UserDocument } from './user/entities/user.schema';

export const GetAuthenticatedUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserDocument => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
