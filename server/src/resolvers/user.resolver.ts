import { Arg, Mutation, Query, Resolver } from "type-graphql";
import UserService from "../services/user.service";
import User, {
  LoginInfo,
  UserLogin,
  UserRegister,
} from "../entities/user.entity";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { hash, verify } from "argon2";
import * as jwt from "jsonwebtoken";
@Resolver()
export default class BookResolver {
  @Query(() => [User])
  async users() {
    return await new UserService().listUsers();
  }

  @Query(() => LoginInfo)
  async login(@Arg("infos") infos: UserLogin) {
    const { email, password } = infos;

    //vérification que le user existe bien :
    const user = await new UserService().findByEmail(email);
    if (!user) {
      throw new GraphQLError("Ce compte n'existe pas!", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
    }
    //isPasswordCorrect sera un boolean, si true ça veut dire que le hashage du mot de passe stocké est le même que le mot de passe reçu, donc qu'ils sont pareils
    const isPasswordCorrect = await verify(user.password, password);
    if (!isPasswordCorrect) {
      throw new GraphQLError("Vérifiez vos informations!", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
    }

    //génération du token permettant ensuite de s'authentifié auprès de chaque resolvers sans indiquer un identifiant et un mot de passe
    const token = jwt.sign({ email }, `${process.env.SECRET_KEY}`); // on stocke ici un payload qui est un objet contenant email, signé grâce à la clé secrète
    console.log("TOKEN", token);
    return { token };
  }

  @Mutation(() => User)
  async register(@Arg("infos") infos: UserRegister) {
    const { email, password: plainPassword } = infos;

    //vérification que le user n'existe pas déjà :
    const user = await new UserService().findByEmail(email);

    if (user) {
      throw new GraphQLError("Cet email est déjà pris", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
    }
    //hashage du mot de passe
    const password = await hash(plainPassword);

    return await new UserService().register({
      email,
      password,
    });
  }
}