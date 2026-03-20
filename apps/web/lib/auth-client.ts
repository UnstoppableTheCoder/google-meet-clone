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
} = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [inferAdditionalFields<typeof auth>()],
});
