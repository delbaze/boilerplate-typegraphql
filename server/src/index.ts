import BookResolver from './resolvers/book.resolver';
import datasource from './lib/datasource';
import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'reflect-metadata';


async function main() {
  const schema = await buildSchema({
    resolvers: [BookResolver],
    validate: false
  });
  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  await datasource.initialize();
  console.log(`🚀  Server ready at: ${url}`);
}

main();
