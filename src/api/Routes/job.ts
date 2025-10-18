import { Router } from "express";
import { viewCompanyJob, viewCreateJob, viewDeleteJob, viewPublishJob, viewUpdateJob } from "../Controllers/job";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { jobSchema } from "../../Validators/validations";
const router = Router();

//JOBS
router.get("/", isAuthenticated, hasPermission("view_company_job"), viewCompanyJob);
router.post("/", isAuthenticated, hasPermission("add_company_job"), validate(jobSchema), viewCreateJob);
router.put("/:jobId", isAuthenticated, hasPermission("update_company_job"), viewUpdateJob);
router.put("/publish/:jobId", isAuthenticated, hasPermission("publish_job"), viewPublishJob);
router.delete("/:jobId", isAuthenticated, hasPermission("delete_job"), viewDeleteJob);


export default router;
