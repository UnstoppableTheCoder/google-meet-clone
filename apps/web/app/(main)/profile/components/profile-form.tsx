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
import { Label } from "@repo/ui/components/label";
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
    console.log(file);

    const formData = new FormData();

    if (file) {
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

    const response = await fetch(`/api/upload-image`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    const { data, error } = await updateUser({
      name: payload.name,
      image: result.url,
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
    <Card className="rounded-2xl border border-border bg-card shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Account Settings
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Update your profile information and profile picture.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>

            <Input
              id="name"
              defaultValue={user?.name}
              {...register("name")}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              Profile Picture
            </Label>

            <Input
              id="file"
              type="file"
              {...register("file")}
              className="h-11 rounded-xl file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="h-11 rounded-xl px-6"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl px-6 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
