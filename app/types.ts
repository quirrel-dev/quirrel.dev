// types.ts
import { DefaultCtx, SessionContext, simpleRolesIsAuthorized } from "blitz"
import { User } from "db"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: typeof simpleRolesIsAuthorized
    PublicData: {
      userId: User["id"]
      roles: string[]
    }
  }
}
