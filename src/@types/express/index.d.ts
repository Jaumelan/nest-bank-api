import { Users } from './users/user.entity';

export declare global {
  namespace Express {
    export interface Request {
      user?: Users;
    }
  }
}
