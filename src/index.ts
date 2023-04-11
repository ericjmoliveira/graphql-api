import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { randomUUID } from 'node:crypto';
interface Player {
  id: string;
  name: string;
  age: number;
  available: boolean;
}

let players: Player[] = [
  { id: randomUUID(), name: 'Lionel Messi', age: 35, available: true },
  { id: randomUUID(), name: 'Cristiano Ronaldo', age: 38, available: true },
  { id: randomUUID(), name: 'Erling Haaland', age: 22, available: true },
  { id: randomUUID(), name: 'Kylian Mbappé', age: 24, available: true },
  { id: randomUUID(), name: 'Vinicius Junior', age: 22, available: true }
];

const typeDefs = `#graphql
  type Player {
    id: ID!
    name: String!
    age: Int!
    available: Boolean!
  }

  type Query {
    getPlayers: [Player!]!
    getPlayer(id: ID!): Player
  }

  type Mutation {
    addPlayer(name: String!, age: Int!): Player
    updatePlayer(id: ID!): Player
    deletePlayer(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    getPlayers() {
      return players;
    },

    getPlayer(_: Player, args: { id: string }) {
      return players.find((player) => player.id === args.id);
    }
  },

  Mutation: {
    addPlayer(_: Player, args: { name: string; age: number }) {
      const newPlayer = { id: randomUUID(), name: args.name, age: args.age, available: true };

      players.push(newPlayer);

      return newPlayer;
    },

    updatePlayer(_: Player, args: { id: string }) {
      const newPlayers = players.map((player) => {
        if (player.id === args.id) {
          player.available = !player.available;
        }

        return player;
      });

      players = newPlayers;

      return players.find((player) => player.id === args.id);
    },

    deletePlayer(_: Player, args: { id: string }) {
      const newPlayers = players.filter((player) => player.id !== args.id);

      players = newPlayers;

      return 'Player deleted!';
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

async function main() {
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

  console.log(`🚀  Server ready at: ${url}`);
}

main();
