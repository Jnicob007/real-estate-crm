import type { PublicUser } from '@real-estate-crm/shared-types';

declare global {
  namespace Express {
    interface Request {
      currentUser?: PublicUser;
    }
  }
}

export {};
