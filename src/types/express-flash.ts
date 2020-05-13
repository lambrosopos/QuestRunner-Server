// / <reference types="express" />

/**
 * This type definition augments existing definition
 * from @types/express-flash
 */
declare namespace Express {
  export interface Request {
    user?: any;
  }
}

interface User {
  user?: any;
}

declare module "express-flash";
