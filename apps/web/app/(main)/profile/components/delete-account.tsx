import { deleteUser } from "@/lib/auth-client";
import { CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteAccount() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    await deleteUser();
    router.push("/");
  };

  return (
    <div className="border border-error bg-base-300 p-3 rounded-lg">
      <CardHeader>
        <CardTitle className="text-error">Danger Zone</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm text-base-content/70">
          Delete your account permanently.
        </p>

        <button className="btn btn-error" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </CardContent>
    </div>
  );
}
