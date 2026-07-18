import * as z from "zod";

export const signupSchema = z
  .object({
    name: z.string("Name is required"),
    email: z
      .email("Email is required")
      .max(50, "Email must be less than 30 characters"),
    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const signInSchema = z.object({
  email: z
    .email("Email is required")
    .max(50, "Email must be less than 30 characters"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters"),
});

export const profileSchema = z.object({
  name: z.string().optional(),
  file: z.any(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string("Current password is required").min(6).max(100),
    newPassword: z.string("Current password is required").min(6).max(100),
    confirmPassword: z.string("Current password is required").min(6).max(100),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const forgotPasswordSchema = z.object({
  email: z
    .email("Email is required")
    .max(50, "Email must be less than 30 characters"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string("Current password is required").min(6).max(100),
    confirmPassword: z.string("Current password is required").min(6).max(100),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });
