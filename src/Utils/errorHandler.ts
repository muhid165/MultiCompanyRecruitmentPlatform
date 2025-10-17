import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error:- ", err);
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const field = (err.meta?.target as string[] | undefined)?.[0];
        return res.status(400).json({
          message: `Unique constraint failed: ${field} already exists.`,
        });
      }
      case "P2003":
        const field = err.meta?.field_name;
        return res.status(400).json({
          message: `Foreign key constraint violation on ${field}`,
        });
      case "P2025":
        return res.status(404).json({
          message: "Record not found.",
        });
      default:
        return res.status(500).json({ message: "Unknown database Error" });
    }
  } else if (err instanceof ZodError) {
    const errorDetails = err.issues
      .map((error: any) => {
        return `Field: ${error.path.join(".")} - ${error.message} (Expected: ${
          error.expected
        }, Received: ${error.received})`;
      })
      .join(", ");
    return res
      .status(400)
      .json({ message: `Validation failed: ${errorDetails} ` });
  } else if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. The maximum allowed file size is 5MB.",
      });
    }
    return res.status(400).json({ message: `Multer Error: ${err.message}` });
  } else if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    return res.status(500).json({ message: "An Unknows Errro occurred" });
  }
  next(err);
};