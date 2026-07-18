import "../env";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { APIError, betterAuth } from "better-auth";
import { getDB, client } from "@repo/db";
import { bearer } from "better-auth/plugins";
import { sendEmail } from "./services/email.service";

const db = await getDB();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // After sign up, you shouldn't be auto signed in
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  user: {
    additionalFields: {},
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    deleteUser: {
      enabled: true,
      beforeDelete: async (user, request) => {
        if (user.email.includes("admin")) {
          throw new APIError("BAD_REQUEST", {
            message: "Admin accounts can't be deleted",
          });
        }
      },
      sendDeleteAccountVerification: async ({ user, url }) => {
        void sendEmail({
          to: user.email,
          subject: "Confirm Account Deletion",
          text: `Click the link to confirm deleting your account: ${url}`,
        });
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [bearer()],
});

export type Session = typeof auth.$Infer.Session;
