import { Account, Client, Graphql, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_aPPWRITE_ENDPOINT as string)
  .setProject(import.meta.env.VITE_aPP_APPWRITE_PROJECT_ID as string);

export const graphql = new Graphql(client);

export const account = new Account(client);

export const database = new Databases(client);
