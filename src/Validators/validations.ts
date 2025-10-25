import {
  CompanyStatus,
  UserType,
  EmploymentType,
  ApplicationStatus,
} from "@prisma/client";
import { z } from "zod";

export const roleSchema = z.object({
  companyId: z.uuid().optional(),
  code: z
    .string()
    .trim()
    .min(2, { message: "Code must be atleast 2 characters" })
    .max(150, { message: "Code must not be more than 100 characters" }),
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be atleast 2 characters" })
    .max(150, { message: "Name must not be more than 100 characters" }),
  roleType: z.enum(Object.values(UserType) as [string, ...string[]]).optional(),
  description: z.string().optional(),
});

export const bulkDeleteSchema = z.object({
  ids: z
    .array(z.string().min(1, { message: "ID cannot be empty" }))
    .nonempty({ message: "At least one ID is required for bulk deletion" }),
});

export const userSchema = z.object({
  roleId: z.string().optional(),
  email: z.email({ message: "Invalid email address" }),
  fullName: z
    .string()
    .trim()
    .min(3, { message: "full Name must be atleast 3 characters" })
    .max(150, { message: "firstName must not be more than 100 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, {
      message:
        "Phone number must be a valid 10-digit Indian number (e.g. 9876543210)",
    }),
});

export const companySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Company name must be at least 3 characters" })
    .max(150, { message: "Company name must not exceed 150 characters" }),
  logoUrl: z.url({ message: "Logo URL must be valid" }).optional(),
  websiteUrl: z.url({ message: "Website URL must be valid" }).optional(),
  careerPageUrl: z.url({ message: "Career page URL must be valid" }).optional(),
  location: z
    .string()
    .min(5, { message: "location cannot be less than 5 characters" })
    .max(500, { message: "location must not exceed 500 characters" }),
  description: z
    .string()
    .trim()
    .max(500, { message: "Description must not exceed 500 characters" })
    .optional(),
  status: z
    .enum(Object.values(CompanyStatus) as [string, ...string[]])
    .default("ACTIVE"),
  isDeleted: z.boolean().default(false),
  roleId: z.string().optional(),
});

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Department name must be at least 2 characters long" })
    .max(100, { message: "Department name must not exceed 100 characters" }),
  description: z
    .string()
    .trim()
    .max(300, { message: "Description must not exceed 300 characters" })
    .optional(),
});

export const jobSchema = z.object({
  department: z.string(),
  title: z
    .string()
    .trim()
    .min(3, { message: "Job title must be at least 3 characters long" })
    .max(150, { message: "Job title must not exceed 150 characters" }),
  location: z
    .string()
    .trim()
    .min(5, { message: "Location must be at least 5 characters long" })
    .max(150, { message: "Location must not exceed 150 characters" }),
  experience: z
    .string()
    .trim()
    .max(100, { message: "Experience must not exceed 100 characters" })
    .optional(),
  salaryRange: z
    .string()
    .trim()
    .max(100, { message: "Salary range must not exceed 100 characters" })
    .optional(),
  employmentType: z.enum(
    Object.values(EmploymentType) as [string, ...string[]],
    {
      message: "Invalid employment type",
    }
  ),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long" }),
  responsibilities: z.string().trim().min(10, {
    message: "Responsibilities must be at least 10 characters long",
  }),
  requirements: z
    .string()
    .trim()
    .min(10, { message: "Requirements must be at least 10 characters long" }),
});

export const applicationSchema = z.object({
  jobId: z.uuid({ message: "jobId must be a valid UUID" }),
  companyId: z.string({ message: "companyId must be a valid UUID" }),
  candidateName: z
    .string()
    .trim()
    .min(2, { message: "Candidate name must be at least 2 characters long" })
    .max(100, { message: "Candidate name must not exceed 100 characters" }),
  email: z.email({ message: "Please provide a valid email address" }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, {
      message:
        "Phone number must be a valid 10-digit Indian number (e.g. 9876543210)",
    }),
  experience: z.json().optional(),
  skills: z.json().optional(),
  currentCTC: z.string().optional(),
  expectedCTC: z.string().optional(),
  noticePeriod: z
    .string()
    .trim()
    .max(50, { message: "Notice period must not exceed 50 characters" })
    .optional(),
  source: z
    .string()
    .trim()
    .max(100, { message: "Source must not exceed 100 characters" })
    .default("Career Page"),
});

export const applicationNoteSchema = z.object({
  // applicationId: z.uuid({ message: "applicationId must be a valid UUID" }),
  note: z
    .string()
    .trim()
    .min(5, { message: "Note must be at least 5 characters long" })
    .max(1000, { message: "Note must not exceed 1000 characters" }),
});

export const applicationStatusSchema = z.object({
  status: z.enum(Object.values(ApplicationStatus) as [string, ...string[]]),
});

export const assignmentSchema = z.object({
  companyId: z.uuid({ message: "companyId must be a valid UUID" }),
  userId: z.uuid({ message: "userId must be a valid UUID" }),
});
