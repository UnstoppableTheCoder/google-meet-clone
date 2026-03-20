import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { getDB, client } from "@repo/db";
import { bearer } from "better-auth/plugins";

const db = await getDB();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      profileUrl: {
        type: "string",
      },
    },
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [bearer()],
});

export type Session = typeof auth.$Infer.Session;
