import { AuthCheckerInterface, ResolverData } from "type-graphql";
import { IContext } from "../index.d";
import User from "../entities/user.entity";
import { Repository } from "typeorm";

export class AuthChecker implements AuthCheckerInterface<IContext> {
  constructor(private readonly userRepository: Repository<User>) {}

  check(
    { root, args, context, info }: ResolverData<IContext>,
    roles: string[] // roles est récupéré depuis les parenthèses de @Authorized() : exemple : @Authorized(["ADMIN", "USER"])
  ) {
    const { user } = context;
    return user !== null; // ici la vérification est simple, mais on aurait pu jouer sur les rôles :
    // return user.roles === roles // à ce moment là, si vous mettez par exemple @Authorized(["ADMIN"]) et que user.roles = ["ADMIN"] en base de données vous authoriserez uniquement si le user a le rôle en question
  }
}
