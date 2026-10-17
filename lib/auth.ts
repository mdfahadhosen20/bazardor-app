import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME ?? "cluster0";
const authBaseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const authSecret =
  process.env.BETTER_AUTH_SECRET ?? "local-development-secret-change-me";

const globalForDatabase = globalThis as unknown as {
  cluster0MongoClient?: MongoClient;
};

const client =
  globalForDatabase.cluster0MongoClient ??
  new MongoClient(uri ?? "mongodb://127.0.0.1:27017", {
    appName: "@cluster0",
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxIdleTimeMS: 30000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.cluster0MongoClient = client;
}

const database = uri && databaseName ? client.db(databaseName) : undefined;

const configuredSocialProviders: Record<string, any> = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          prompt: "select_account" as const,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          scope: ["read:user", "user:email"],
        },
      }
    : {}),
};

const authConfig = {
  appName: "cluster0",
  baseURL: authBaseURL,
  secret: authSecret,

  ...(database
    ? {
        database: mongodbAdapter(database, {
          client,
        }),
      }
    : {}),

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
    minPasswordLength: 8,
  },

  ...(Object.keys(configuredSocialProviders).length > 0
    ? { socialProviders: configuredSocialProviders as any }
    : {}),
} satisfies Parameters<typeof betterAuth>[0];

export const auth = betterAuth(authConfig);