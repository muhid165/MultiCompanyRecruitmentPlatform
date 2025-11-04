import { Router } from "express";
import {
  deleteDepartmentById,
  viewCompanyDepartments,
  viewCreateDepartment,
  viewDeleteBulkDepartments,
  viewDepartments,
  viewSearchDepartments,
  viewUpdateDepartment,
} from "../Controllers/department";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { bulkDeleteSchema, departmentSchema } from "../../Validators/validations";
const router = Router();

//DEPARTMENTS
router.get("/search", isAuthenticated, hasPermission("view_company_department"), viewSearchDepartments);
router.get("/filter", isAuthenticated, hasPermission("view_company_department"), viewDepartments);
router.get("/", isAuthenticated, hasPermission("view_company_department"), viewCompanyDepartments);
router.post("/", isAuthenticated, hasPermission("add_company_department"), validate(departmentSchema), viewCreateDepartment);
router.put("/:id", isAuthenticated, hasPermission("edit_company_department"), validate(departmentSchema), viewUpdateDepartment);
router.delete("/bulk", isAuthenticated, hasPermission("delete_company_department"), validate(bulkDeleteSchema), viewDeleteBulkDepartments); // new
router.delete("/:id", isAuthenticated, hasPermission("delete_company_department"), deleteDepartmentById);

export default router;
