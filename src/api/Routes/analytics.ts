import { Router } from "express";
import { viewGlobalAnalytics, viewCompanyAnalytics } from "../Controllers/analytics";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";

const router = Router();

router.get("/", isAuthenticated, hasPermission("view_analytics"), viewGlobalAnalytics);
router.get("/:companyId", isAuthenticated, hasPermission("view_analytics"), viewCompanyAnalytics);

export default router;
