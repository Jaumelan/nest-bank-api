import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Users } from '../users.entity';

@Injectable()
export class AuthGuardService extends AuthGuard('jwt') implements IAuthGuard {
  public handleRequest(err: unknown, user: Users): any {
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request: Request = context.switchToHttp().getRequest();
    //console.log(context.switchToHttp().getRequest());
    //console.log('request: ', request);
    return request.user ? true : false;
  }
}
