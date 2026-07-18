import { signIn } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import React from "react";

export default function SocialAuth({
  isSubmitting,
  isSignupPage,
}: {
  isSubmitting: boolean;
  isSignupPage: boolean;
}) {
  const handleContinueWithGoogle = async () => {
    const data = await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
    });
  };

  const handleContinueWithGithub = async () => {
    const data = await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
    });
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleContinueWithGoogle}
          className="group h-11 rounded-xl border-border bg-background transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:shadow-md"
        >
          {/* <FcGoogle className="mr-2 h-5 w-5" /> */}
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleContinueWithGithub}
          className="group h-11 rounded-xl border-border bg-background transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:shadow-md"
        >
          {/* <FaGithub className="mr-2 h-5 w-5" /> */}
          GitHub
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        {isSignupPage ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          href={isSignupPage ? "/sign-in" : "/sign-up"}
          className="font-semibold text-primary underline-offset-4 transition-all hover:text-primary/80 hover:underline"
        >
          {isSignupPage ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
