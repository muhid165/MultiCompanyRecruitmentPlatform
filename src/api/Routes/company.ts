import { Router } from "express";
import { assingCompanyAdmins, deleteCompany, viewAllCompanies, viewCompanyById, viewCreateCompany, viewDeleteBulkCompanies, viewFilterCompanies, viewSearchCompany, viewUpdateCompany } from "../Controllers/company";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { upload } from "../Middlewares/multer";
const fileUpload = upload.single("file");
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { bulkDeleteSchema, companySchema } from "../../Validators/validations";
const router = Router();

//COMPANIES
router.get("/search", isAuthenticated, hasPermission("view_all_companies"), viewSearchCompany); //
router.get("/filter", isAuthenticated, hasPermission("view_all_companies"), viewFilterCompanies); // filter 
router.get("/", isAuthenticated, hasPermission("view_all_companies"), viewAllCompanies); //
router.get("/:id", isAuthenticated, hasPermission("view_company"), viewCompanyById); 
router.post("/", isAuthenticated, hasPermission("add_company"), fileUpload,  viewCreateCompany); //
router.put("/:id", isAuthenticated, hasPermission("edit_company"), fileUpload, validate(companySchema), viewUpdateCompany);
router.delete("/bulk", isAuthenticated, hasPermission("delete_company"),validate(bulkDeleteSchema), viewDeleteBulkCompanies); // new
router.delete("/:id", isAuthenticated, hasPermission("delete_company"), deleteCompany);
// router.post("/admins", isAuthenticated, hasPermission("add_company_admin"), assingCompanyAdmins); // no need till now 


export default router;
