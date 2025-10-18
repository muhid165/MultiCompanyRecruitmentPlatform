import { Router } from "express";
import { assingCompanyAdmins, deleteCompany, viewAllCompanies, viewCompanyById, viewCreateCompany, viewUpdateCompany } from "../Controllers/company";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { upload } from "../Middlewares/multer";
const fileUpload = upload.single("file");
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { companySchema } from "../../Validators/validations";
const router = Router();

//COMPANIES
router.get("/", isAuthenticated, hasPermission("view_all_companies"), viewAllCompanies); //
router.post("/", isAuthenticated, hasPermission("create_company"), fileUpload, validate(companySchema), viewCreateCompany); //
router.put("/:id", isAuthenticated, hasPermission("edit_company"), fileUpload, validate(companySchema), viewUpdateCompany);
router.delete("/:id", isAuthenticated, hasPermission("delete_company"), deleteCompany);
router.get("/:companyId", isAuthenticated, hasPermission("view_company"), viewCompanyById); 
router.post("/admins", isAuthenticated, hasPermission("add_company_admin"), assingCompanyAdmins);

export default router;
