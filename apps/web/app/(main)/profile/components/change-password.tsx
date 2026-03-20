import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { changePasswordSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { revokeOtherSessions } from "better-auth/api";
import { changePassword } from "@/lib/auth-client";
import { toast } from "sonner";
type ChangePassword = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (payload: ChangePassword) => {
    const { data, error } = await changePassword({
      newPassword: payload.newPassword,
      currentPassword: payload.currentPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message || "Error changing the password");
    } else {
      toast.success("Password updated successfully");
    }

    reset();
  };

  return (
    <Card className="bg-base-100 border border-base-300">
      <CardHeader>
        <CardTitle className="text-base-content">Change Password</CardTitle>
      </CardHeader>

      <form className="space-y-4 px-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="password"
          placeholder="Current Password"
          className="text-white"
          {...register("currentPassword")}
        />
        <div className="text-red-600">
          {errors.currentPassword && errors.currentPassword.message}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Input
              type="password"
              placeholder="New Password"
              className="text-white"
              {...register("newPassword")}
            />
            <div className="text-red-600">
              {errors.newPassword && errors.newPassword.message}
            </div>
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              className="text-white"
              {...register("confirmPassword")}
            />
            <div className="text-red-600">
              {errors.confirmPassword && errors.confirmPassword.message}
            </div>
          </div>
        </div>

        <Button className="btn btn-primary ml-auto" type="submit">
          {isSubmitting ? "Updating" : "Update Password"}
        </Button>
      </form>
    </Card>
  );
}
