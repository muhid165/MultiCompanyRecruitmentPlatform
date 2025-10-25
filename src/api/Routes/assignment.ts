import { Router } from "express";
import { validate } from "../Middlewares/validate";
import { assignmentSchema } from "../../Validators/validations";
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { viewAssignments, viewAssignmentsById, viewCreateAssignment, viewDeleteAssignment, viewUpdateAssignment } from "../Controllers/assignment";
import { hasPermission } from "../Middlewares/permission";

const router = Router();

// Create assignment
router.post("/assignment", isAuthenticated, validate(assignmentSchema), hasPermission("add_assingment"), viewCreateAssignment);

// Get all assignments
router.get("/assignments", isAuthenticated, hasPermission("view_assingment"), viewAssignments);

// Get by ID
router.get("/assignments/:id", isAuthenticated, hasPermission("view_assingment"), viewAssignmentsById);

// Update
router.put(
  "/assignments/:id",
  isAuthenticated,
  validate(assignmentSchema.partial()), // allow partial fields for update
  hasPermission("edit_assingment"),
  viewUpdateAssignment
);

// Delete
router.delete("/assignments/:id", isAuthenticated, hasPermission("delete_assingment"), viewDeleteAssignment);

export default router;
