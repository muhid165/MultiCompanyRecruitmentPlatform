import { Router } from "express";
import { deleteDepartmentById, viewCompanyDepartments, viewCreateDepartment, viewUpdateDepartment } from "../Controllers/department";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
import { validate } from "../Middlewares/validate";
import { departmentSchema } from "../../Validators/validations";
const router = Router();

//DEPARTMENTS
router.get("/", isAuthenticated, hasPermission("view_company_department"), viewCompanyDepartments);
router.post("/", isAuthenticated, hasPermission("add_company_department"), validate(departmentSchema), viewCreateDepartment);
router.put("/:deptId", isAuthenticated, hasPermission("update_company_department"), validate(departmentSchema), viewUpdateDepartment);
router.delete("/:deptId", isAuthenticated, hasPermission("delete_company_department"), deleteDepartmentById);

export default router;
