import { Router } from "express";
import { filterJobs, viewCompanyJob, viewCreateJob, viewDeleteBulkjobs, viewDeleteJob, viewPublishedCompanyJob, viewPublishJob, viewSearchJobs, viewUpdateJob } from "../Controllers/job";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { bulkDeleteSchema, jobSchema } from "../../Validators/validations";
const router = Router();

//JOBS
router.get("/search", isAuthenticated, hasPermission("view_company_job"), viewSearchJobs);
router.get("/filter", isAuthenticated, filterJobs);
router.get("/", isAuthenticated, hasPermission("view_company_job"), viewCompanyJob);
router.post("/", isAuthenticated, hasPermission("add_company_job"), validate(jobSchema), viewCreateJob);
router.put("/:jobId", isAuthenticated, hasPermission("edit_company_job"), viewUpdateJob);
router.put("/publish/:jobId", isAuthenticated, hasPermission("publish_job"), viewPublishJob);
router.delete("/bulk", isAuthenticated, hasPermission("delete_job"), validate(bulkDeleteSchema), viewDeleteBulkjobs); // new
router.delete("/:jobId", isAuthenticated, hasPermission("delete_job"), viewDeleteJob);

router.get("/published", viewPublishedCompanyJob); // open API

export default router;
