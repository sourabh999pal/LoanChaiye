import { z } from "zod";

export const loanFormSchema = z.object({
  fullName: z.string().optional(),
  mobileNumber: z.string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must not exceed 15 digits")
    .regex(/^[0-9+\s-]+$/, "Invalid mobile number format"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  panCard: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format (e.g., ABCDE1234F)")
    .optional().or(z.literal("")),
  occupationType: z.string({
    required_error: "Please select an occupation type",
  }),
  companyName: z.string().optional().or(z.literal("")),
  monthlySalary: z.string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => !val || val > 0, {
      message: "Monthly salary must be a positive number",
    }),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const filterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  occupationType: z.string().optional(),
});
