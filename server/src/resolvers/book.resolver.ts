import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import BookService from "../services/book.service";
import Book from "../entities/book.entity";
import { IContext } from "../index.d";
import { GraphQLError } from "graphql";

@Resolver()
export default class BookResolver {
  /* 
    Tentons de conditionner la récupération des livres au fait d'être connecté
  */

  /* 
    Première méthode, jouer directement avec le contexte : 
  */

  // @Query(() => [Book])
  // async books(@Ctx() { user }: IContext) {
  //   if (!user) {
  //     throw new GraphQLError("Vous devez être authentifié!");
  //   }
  //   return await new BookService().listBooks();
  // }

  /* 
    Deuxième méthode, jouer avec les décorateurs de Typegraphql (Authorized est directement lié au authchecker chargé dans le buildschema sur index.ts)
  */

  @Authorized(["ADMIN"])
  @Query(() => [Book])
  async books() {
    return await new BookService().listBooks();
  }

  @Mutation(() => Book)
  async addBook(@Arg("title") title: string) {
    return await new BookService().addBook({ title });
  }
}
