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
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
    });
  };

  const handleContinueWithGithub = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
    });
  };

  return (
    <div className="space-y-5 pt-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#111317] px-3 text-[11px] font-medium uppercase tracking-wider text-white/40">
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
          aria-label="Continue with Google"
          data-testid="social-google-button"
          className="h-10 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/90 shadow-none transition-colors hover:border-white/20 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-40"
        >
          {/* <FcGoogle className="mr-2 h-4 w-4" aria-hidden="true" /> */}
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleContinueWithGithub}
          aria-label="Continue with GitHub"
          data-testid="social-github-button"
          className="h-10 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/90 shadow-none transition-colors hover:border-white/20 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-40"
        >
          {/* <FaGithub className="mr-2 h-4 w-4 text-white/90" aria-hidden="true" /> */}
          GitHub
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-white/60">
        {isSignupPage ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          href={isSignupPage ? "/sign-in" : "/sign-up"}
          aria-label={isSignupPage ? "Sign in" : "Create one"}
          data-testid="social-auth-footer-link"
          className="font-medium text-blue-400 transition-colors hover:text-blue-300"
        >
          {isSignupPage ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
