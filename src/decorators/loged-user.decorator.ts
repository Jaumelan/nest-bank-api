import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LogedUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    //console.log(request);
    return request.user;
  },
);
