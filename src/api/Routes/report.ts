import { Router } from "express";
import { exportCompanyReport, exportGlobalReports } from "../Controllers/reports";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";

const router = Router();

router.get("/:companyId", exportCompanyReport);
router.get("/", exportGlobalReports);

export default router;
