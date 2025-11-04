import { Router } from "express";
import { viewAllUsers, viewUserById, deleteUser, viewUpdateUser, assingRole, viewSearchUsers, viewDeleteBulkUsers, viewFilterUser } from "../Controllers/user";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
import { bulkDeleteSchema } from "../../Validators/validations";
import { validate } from "../Middlewares/validate";

const router = Router();

router.get("/search", isAuthenticated, hasPermission("view_users"), viewSearchUsers);
router.get("/filter", isAuthenticated, hasPermission("view_users"), viewFilterUser);
router.get("/:id", isAuthenticated, hasPermission("view_user"), viewUserById);
router.get("/", isAuthenticated, hasPermission("view_users"), viewAllUsers);
router.put("/:id", isAuthenticated, hasPermission("edit_users"), viewUpdateUser);
router.put("/assing/:id", isAuthenticated, hasPermission("edit_user_role"), assingRole);
router.delete("/bulk", isAuthenticated, hasPermission("delete_users"), validate(bulkDeleteSchema), viewDeleteBulkUsers);
router.delete("/:id", isAuthenticated, hasPermission("delete_users"), deleteUser);

export default router;
