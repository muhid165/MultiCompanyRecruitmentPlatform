import { Router } from "express";
import { validate } from "../Middlewares/validate";
// import { generalFilter } from "../../utils/generalFilter";

import { isAuthenticated } from "../Middlewares/authMiddleware";
import { viewBulkExportRoles, viewCreateRole, viewSearchRoles, viewUpdateRole, viewRoles, viewRoleById, viewDeleteBulkRoles, viewDeleteRole, viewBulkCreateRoles } from "../Controllers/role";
import { roleSchema, bulkDeleteSchema } from "../../Validators/validations";
import { upload } from "../Middlewares/multer";
const fileUpload = upload.single("file");
const router = Router();

// Export roles
router.get("/export", isAuthenticated, viewBulkExportRoles);

// Create role
router.post("/role", isAuthenticated, validate(roleSchema), viewCreateRole);

// Search roles
router.get("/search", isAuthenticated, viewSearchRoles);

// Update role
router.put("/:id", isAuthenticated, validate(roleSchema), viewUpdateRole);

// Get all roles
router.get("/", isAuthenticated, viewRoles);

// Get role by ID
router.get("/:id", isAuthenticated, viewRoleById);

// Bulk delete roles 
router.delete("/bulk", isAuthenticated, validate(bulkDeleteSchema), viewDeleteBulkRoles);

// Delete single role 
router.delete("/:id", isAuthenticated, viewDeleteRole);

// Import roles
router.post("/import", isAuthenticated, fileUpload, viewBulkCreateRoles);

export default router;
