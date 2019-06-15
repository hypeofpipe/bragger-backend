export type MixedEntity = {
  typeDef: {
    type?: string;
    query?: string;
    mutation?: string;
  };
  resolvers: {
    query: Record<string, Function>;
    mutation: Record<string, Function>;
  };
};
