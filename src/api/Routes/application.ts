import { Router } from "express";
import {
  deleteApplicationNote,
  viewApplicationHistory,
  viewCreateApplication,
  viewCreateApplicationNote,
  viewCompanyApplications,
  viewApplicationNotes,
  viewSearchApplications,
  viewDeleteApplication,
  viewDeleteBulkApplications,
  viewUpdateApplication,
  viewApplicationById,
} from "../Controllers/application";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { applicationNoteSchema, applicationSchema, applicationStatusSchema, bulkDeleteSchema, updateApplicationSchema } from "../../Validators/validations";
import { upload } from "../Middlewares/multer";
import { verifyCompanyToken } from "../Middlewares/companyToken";
const fileUpload = upload.single("resume");
const router = Router();

//APPLICATIONS
router.get("/history/:id", isAuthenticated, hasPermission("view_application_history"), viewApplicationHistory);
router.get("/search", isAuthenticated, hasPermission("view_application"), viewSearchApplications);
router.get("/note/:id", isAuthenticated, hasPermission("view_application_note"), viewApplicationNotes);
router.get("/:id", isAuthenticated, hasPermission("view_application"), viewApplicationById);
router.get("/", isAuthenticated, hasPermission("view_application"), viewCompanyApplications);
router.post("/note/:id", isAuthenticated, hasPermission("add_application_note"), validate(applicationNoteSchema), viewCreateApplicationNote);
router.put("/:id", isAuthenticated, hasPermission("edit_application"), fileUpload, validate(updateApplicationSchema), viewUpdateApplication);

router.delete("/bulk", isAuthenticated, hasPermission("delete_application"), validate(bulkDeleteSchema), viewDeleteBulkApplications); // new
router.delete("/:id", isAuthenticated, hasPermission("delete_application"), viewDeleteApplication);
router.delete("/note/:id", isAuthenticated, hasPermission("delete_application_note"), deleteApplicationNote);

router.post("/submit", fileUpload, validate(applicationSchema), viewCreateApplication); //open api

export default router;
