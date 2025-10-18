import { Router } from "express";
import {
  deleteApplicationNote,
  viewApplicationHistory,
  viewChangeApplicationStatus,
  viewCreateApplication,
  viewCreateApplicationNote,
  viewCompanyApplications,
} from "../Controllers/application";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { applicationNoteSchema, applicationSchema } from "../../Validators/validations";
import { upload } from "../Middlewares/multer";
const fileUpload = upload.single("file");
const router = Router();

//APPLICATIONS
router.get("/history/:applicationId", isAuthenticated, hasPermission("view_application_history"), viewApplicationHistory);
router.put("/:applicationId", isAuthenticated, hasPermission("change_application_status"), viewChangeApplicationStatus);
router.post("/note/:applicationId", isAuthenticated, hasPermission("add_application_note"), validate(applicationNoteSchema), viewCreateApplicationNote);
router.delete("/note/:noteId", isAuthenticated, hasPermission("delete_application_note"), deleteApplicationNote);

router.post("/submit", fileUpload, validate(applicationSchema), viewCreateApplication); //open api
router.get("/", viewCompanyApplications); // open api

export default router;
