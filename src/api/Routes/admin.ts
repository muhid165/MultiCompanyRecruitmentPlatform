import { Router } from "express";
// import { viewAllCompanies,viewCreateCompany } from "../Controllers/admin";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { upload } from "../Middlewares/multer";
const router = Router();

// ----------> Admin Companies <---------------



