import { Router } from "express";
import {
  assingCompanyAdmins,
  deleteCompany,
  viewAllCompanies,
  viewCompanyApplications,
  viewCompanyById,
  viewCompanyDepartment,
  viewCompanyJobs,
  viewCreateCompany,
  viewUpdateCompany,
} from "../Controllers/company";
import { deleteDepartmentById, viewCompanyDepartments, viewCreateDepartment, viewUpdateDepartment } from "../Controllers/department";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { upload } from "../Middlewares/multer";
const fileUpload = upload.single("file");
import { hasPermission } from "../Middlewares/permission";
import { viewCompanyJob, viewCreateJob, viewDeleteJob, viewPublishJob, viewUpdateJob } from "../Controllers/job";
import { deleteApplicationNote, viewApplicationHistory, viewChangeApplicationStatus, viewCreateApplication, viewCreateApplicationNote } from "../Controllers/application";
import { validate } from "../Middlewares/validate";
import { applicationNoteSchema, applicationSchema, companySchema, departmentSchema, jobSchema } from "../../Validators/validations";
const router = Router();

//COMPANIES
router.get("/", isAuthenticated, hasPermission("view_all_companies"), viewAllCompanies); //
router.post("/", isAuthenticated, hasPermission("create_company"), fileUpload, validate(companySchema), viewCreateCompany); //
router.put("/:id", isAuthenticated, hasPermission("edit_company"), fileUpload, validate(companySchema), viewUpdateCompany);
router.delete("/:id", isAuthenticated, hasPermission("delete_company"), deleteCompany);

router.get("/:companyId", isAuthenticated, hasPermission("view_company"), viewCompanyById); // doubt

router.post("/:companyId/admins", isAuthenticated, hasPermission("add_company_admin"), assingCompanyAdmins);
//DEPARTMENTS
router.get("/:companyId/departments/", isAuthenticated, hasPermission("view_company_department"), viewCompanyDepartments);
router.post("/:companyId/department/", isAuthenticated, hasPermission("add_company_department"), validate(departmentSchema), viewCreateDepartment);
router.put("/department/:deptId", isAuthenticated, hasPermission("update_company_department"), validate(departmentSchema), viewUpdateDepartment);
router.delete("/department/:deptId", isAuthenticated, hasPermission("delete_company_department"), deleteDepartmentById);

//JOBS
router.get("/jobs/:companyId", isAuthenticated, hasPermission("view_company_job"), viewCompanyJob);
router.post("/job/:companyId", isAuthenticated, hasPermission("add_company_job"), validate(jobSchema), viewCreateJob);
router.put("/job/:jobId", isAuthenticated, hasPermission("update_company_job"), validate(jobSchema), viewUpdateJob);
router.put("/job/publish/:jobId", isAuthenticated, hasPermission("publish_job"), viewPublishJob);
router.delete("/job/:jobId", isAuthenticated, hasPermission("delete_job"), viewDeleteJob);

//APPLICATIONS
router.put("/application/:applicationId", isAuthenticated, hasPermission("change_application_status"), viewChangeApplicationStatus);
router.get("/application/:applicationId", isAuthenticated, hasPermission("view_application_history"), viewApplicationHistory);
router.post("/application/note/:applicationId", isAuthenticated, hasPermission("add_application_note"), validate(applicationNoteSchema), viewCreateApplicationNote);
router.delete("/application/note/:noteId", isAuthenticated, hasPermission("delete_application_note"), deleteApplicationNote);

router.post("/application", fileUpload, validate(applicationSchema), viewCreateApplication); //open api
router.get("/application/:companyId", viewCompanyApplications); // open api
export default router;
