import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@repo/auth";

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  updateUser,
  changePassword,
  deleteUser,
  requestPasswordReset,
  resetPassword,
} = createAuthClient({
  baseURL: process.env.WEB_BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});
