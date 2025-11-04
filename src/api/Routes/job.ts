import { Router } from "express";
import { filterJobs, viewCompanyJob, viewCreateJob, viewDeleteBulkjobs, viewDeleteJob, viewJobById, viewPublishedCompanyJob, viewSearchJobs, viewUpdateJob } from "../Controllers/job";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { bulkDeleteSchema, jobSchema, updateJobSchema } from "../../Validators/validations";
const router = Router();

//JOBS
router.get("/search", isAuthenticated, hasPermission("view_company_job"), viewSearchJobs);
router.get("/filter", isAuthenticated, hasPermission("view_company_job"), filterJobs); //
router.get("/:id", isAuthenticated, hasPermission("view_company_job"), viewJobById); //
router.get("/", isAuthenticated, hasPermission("view_company_job"), viewCompanyJob);
router.post("/", isAuthenticated, hasPermission("add_company_job"), validate(jobSchema), viewCreateJob);
router.put("/:id", isAuthenticated, hasPermission("edit_company_job"),validate(updateJobSchema), viewUpdateJob);
router.delete("/bulk", isAuthenticated, hasPermission("delete_job"), validate(bulkDeleteSchema), viewDeleteBulkjobs); // new
router.delete("/:id", isAuthenticated, hasPermission("delete_job"), viewDeleteJob);

router.get("/published", viewPublishedCompanyJob); // open API 

export default router;
