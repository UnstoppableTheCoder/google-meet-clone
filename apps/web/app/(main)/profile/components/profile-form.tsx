import { updateUser, useSession } from "@/lib/auth-client";
import { profileSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type ProfileSchema = z.infer<typeof profileSchema>;

export default function ProfileForm({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
  });

  const { data: session } = useSession();
  const user = session?.user;

  const onSubmit = async (payload: ProfileSchema) => {
    const file = payload.file;

    const formData = new FormData();

    if (file) {
      console.log(file[0]);
      if (
        file[0].type !== "image/png" &&
        file[0].type !== "image/jpeg" &&
        file[0].type !== "image/svg+xml"
      ) {
        toast.error("Unsupported file type");
        return;
      }

      formData.append("file", file.item(0));
    }

    const response = await fetch("http://localhost:3000/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    const { data, error } = await updateUser({
      name: payload.name,
      profileUrl: result.url,
    });

    if (error) {
      toast.error(error.message || "Error updating the user");
    } else {
      toast.success("Profile updated successfully");
    }

    setIsEditing(false);
  };

  if (!isEditing) return;

  return (
    <Card className="bg-base-100 border border-base-300 shadow-xl text-base-content">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-sm text-base-content/70">Full Name</label>
            <Input defaultValue={user?.name} {...register("name")} />
          </div>

          <div className="space-y-1 flex flex-col">
            <label className="text-sm text-base-content/70">Profile</label>
            <input
              type="file"
              className="border rounded-lg px-2 py-1.5"
              {...register("file")}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              className="btn btn-primary"
              type="submit"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button className="btn btn-primary" type="submit">
              {isSubmitting ? "Saving Changes" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
