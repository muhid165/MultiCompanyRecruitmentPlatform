import { Router } from "express";
import {
  viewAllUsers,
  viewUserById,
  deleteUser,
  viewUpdateUser,
} from "../Controllers/user";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { upload } from "../Middlewares/multer";
import { hasPermission } from "../Middlewares/permission";
const router = Router();

router.get("/", isAuthenticated, hasPermission("view_users"),  viewAllUsers);
router.get("/:id", isAuthenticated, hasPermission("view_user"), viewUserById);
router.delete("/:id", isAuthenticated, hasPermission("edit_users"),  deleteUser);
router.put("/:id", isAuthenticated, hasPermission("delete_users"),viewUpdateUser);

export default router;
