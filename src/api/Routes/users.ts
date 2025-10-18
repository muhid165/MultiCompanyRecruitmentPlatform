import { Router } from "express";
import { viewAllUsers, viewUserById, deleteUser, viewUpdateUser, assingRole } from "../Controllers/user";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";
const router = Router();

router.get("/", isAuthenticated, hasPermission("view_users"), viewAllUsers);
router.get("/:id", isAuthenticated, hasPermission("view_user"), viewUserById);
router.delete("/:id", isAuthenticated, hasPermission("delete_users"), deleteUser);
router.put("/:id", isAuthenticated, hasPermission("edit_users"), viewUpdateUser);
router.put("/assing/:id", isAuthenticated, hasPermission("edit_user_role"), assingRole);

export default router;
