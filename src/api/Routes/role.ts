import { Router } from "express";
import { validate } from "../Middlewares/validate";
// import { generalFilter } from "../../utils/generalFilter";

import { isAuthenticated } from "../Middlewares/authMiddleware";
import { viewBulkExportRoles, viewCreateRole, viewSearchRoles, viewUpdateRole, viewRoles, viewRoleById, viewDeleteBulkRoles, viewDeleteRole, viewBulkCreateRoles, viewSearchAllRoles, viewFilterRoles } from "../Controllers/role";
import { roleSchema, bulkDeleteSchema } from "../../Validators/validations";
import { upload } from "../Middlewares/multer";
import { hasPermission } from "../Middlewares/permission";
const fileUpload = upload.single("file");
const router = Router();

router.get("/export", isAuthenticated, hasPermission("export_roles"), viewBulkExportRoles);

router.get("/filter", isAuthenticated, hasPermission("view_role"), viewFilterRoles);


// router.get("/search", isAuthenticated, hasPermission("view_role"), viewSearchRoles);
router.get("/search", isAuthenticated, hasPermission("view_role"), viewSearchAllRoles);

router.get("/", isAuthenticated, hasPermission("view_role"), viewRoles);

router.get("/:id", isAuthenticated, hasPermission("view_role"), viewRoleById);

router.post("/role", isAuthenticated, validate(roleSchema), hasPermission("add_role"), viewCreateRole);

router.post("/import", isAuthenticated, fileUpload, hasPermission("add_role"), viewBulkCreateRoles);

router.put("/:id", isAuthenticated, validate(roleSchema), hasPermission("edit_role"), viewUpdateRole);

router.delete("/bulk", isAuthenticated, validate(bulkDeleteSchema), hasPermission("delete_role"), viewDeleteBulkRoles);

router.delete("/:id", isAuthenticated, hasPermission("delete_role"), viewDeleteRole);



export default router;
