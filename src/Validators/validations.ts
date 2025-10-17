import {
  CompanyStatus,
  UserType,
  EmploymentType,
  ApplicationStatus,
} from "@prisma/client";
import { z } from "zod";

export const roleSchema = z.object({
  companyId: z.string().optional(),
  code: z
    .string()
    .trim()
    .min(3, { message: "Code must be atleast 3 characters" })
    .max(150, { message: "Code must not be more than 100 characters" }),
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be atleast 3 characters" })
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
    .min(1, { message: "full Name must be atleast 3 characters" })
    .max(150, { message: "firstName must not be more than 100 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{1,14}$/, {
      message:
        "Phone must be in international format (E.164), e.g. +14155552671",
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
  // companyId: z  //wiil come in params
  //   .uuid({ message: "companyId must be a valid UUID" }),
  departmentId: z.uuid({ message: "departmentId must be a valid UUID" }),
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
  responsibilities: z
    .string()
    .trim()
    .min(10, {
      message: "Responsibilities must be at least 10 characters long",
    }),
  requirements: z
    .string()
    .trim()
    .min(10, { message: "Requirements must be at least 10 characters long" }),
});

export const applicationSchema = z.object({
  jobId: z.uuid({ message: "jobId must be a valid UUID" }),
  companyId: z.uuid({ message: "companyId must be a valid UUID" }),
  candidateName: z
    .string()
    .trim()
    .min(2, { message: "Candidate name must be at least 2 characters long" })
    .max(100, { message: "Candidate name must not exceed 100 characters" }),
  email: z.email({ message: "Please provide a valid email address" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{1,14}$/, {
      message:
        "Phone must be in international format (E.164), e.g. +14155552671",
    }),
  experience: z
    .string()
    .trim()
    .max(100, { message: "Experience must not exceed 100 characters" })
    .optional(),
  skills: z
    .string()
    .trim()
    .max(250, { message: "Skills must not exceed 250 characters" })
    .optional(),
  currentCTC: z
    .number()
    .positive({ message: "Current CTC must be a positive number" })
    .optional(),
  expectedCTC: z
    .number()
    .positive({ message: "Expected CTC must be a positive number" })
    .optional(),
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
  applicationId: z.uuid({ message: "applicationId must be a valid UUID" }),
  userId: z.uuid({ message: "userId must be a valid UUID" }),
  note: z
    .string()
    .trim()
    .min(5, { message: "Note must be at least 5 characters long" })
    .max(1000, { message: "Note must not exceed 1000 characters" }),
});

// no need till now
export const applicationHistorySchema = z.object({
  applicationId: z.uuid({ message: "applicationId must be a valid UUID" }),
  oldStatus: z
    .enum(Object.values(ApplicationStatus) as [string, ...string[]])
    .optional(),
  newStatus: z.enum(Object.values(ApplicationStatus) as [string, ...string[]], {
    message: "Invalid new status value",
  }),
  changeById: z.uuid({ message: "changeById must be a valid UUID" }),
});
