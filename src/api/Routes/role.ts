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

// Export roles
router.get("/export", isAuthenticated, hasPermission("export_roles"), viewBulkExportRoles);

// Create role
router.post("/role", isAuthenticated, validate(roleSchema), hasPermission("add_role"), viewCreateRole);

// flter API
router.get("/filter", isAuthenticated, hasPermission("view_role"), viewFilterRoles);

// Search roles
// router.get("/search", isAuthenticated, hasPermission("view_role"), viewSearchRoles);
router.get("/search", isAuthenticated, hasPermission("view_role"), viewSearchAllRoles);

// Update role
router.put("/:id", isAuthenticated, validate(roleSchema), hasPermission("edit_role"), viewUpdateRole);

// Get all roles
router.get("/", isAuthenticated, hasPermission("view_role"), viewRoles);

// Get role by ID
router.get("/:id", isAuthenticated, hasPermission("view_role"), viewRoleById);

// Bulk delete roles
router.delete("/bulk", isAuthenticated, validate(bulkDeleteSchema), hasPermission("delete_role"), viewDeleteBulkRoles);

// Delete single role
router.delete("/:id", isAuthenticated, hasPermission("delete_role"), viewDeleteRole);

// Import roles
router.post("/import", isAuthenticated, fileUpload, hasPermission("add_role"), viewBulkCreateRoles);


export default router;
