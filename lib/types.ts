import type { UserWithId } from "./auth";

declare module "h3" {
  type H3EventContext = {
    user?: UserWithId;
  };
}
