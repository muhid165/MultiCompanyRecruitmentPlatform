import { Router } from "express";
import { viewAssignGroupsToUser, viewAssignUserPermissions, viewCreateGroupWithPermissions, viewDeleteGroup, viewDeleteGroupPermissions, viewDeleteUserGroups, viewDeleteUserPermissions, viewGroupPermissions, viewGroups, viewLoggedUserPermission, viewPermissions, viewSearchGroups, viewSearchPermissions, viewUpdateGroupPermissions, viewUserGroups, viewUserPermissions } from "../Controllers/permission"
import { isAuthenticated } from "../Middlewares/authMiddleware";
import { hasPermission } from "../Middlewares/permission";

const router = Router();

// Permissions 
router.get('/permissions', isAuthenticated, hasPermission("view_permission"), viewPermissions);
router.get('/permissions/search', isAuthenticated, hasPermission("view_permission"), viewSearchPermissions); // added
router.get('/permission', isAuthenticated, viewLoggedUserPermission);

// Groups 
router.post('/group', isAuthenticated, hasPermission("add_group"), viewCreateGroupWithPermissions);
router.get('/groups', isAuthenticated, hasPermission("view_group"), viewGroups);
router.get('/groups/search', isAuthenticated, hasPermission("view_group"), viewSearchGroups);
router.get('/groups/:id', isAuthenticated, hasPermission("view_group_permission"), viewGroupPermissions);
router.put('/groups/:id', isAuthenticated, hasPermission("edit_group_permission"), viewUpdateGroupPermissions);
router.delete('/groups/:id', isAuthenticated, hasPermission("delete_group_permission"), viewDeleteGroup);
router.delete('/groups/permissions/:id', isAuthenticated, hasPermission("delete_group_permission"), viewDeleteGroupPermissions);

// User Permissions 
router.put('/user-permissions/:userId', isAuthenticated, hasPermission("edit_user_permission"), viewAssignUserPermissions);
router.get('/user-permissions/:userId', isAuthenticated, hasPermission("view_user_permission"), viewUserPermissions);
router.delete('/user-permissions/:userId', isAuthenticated, hasPermission("delete_user_permission"), viewDeleteUserPermissions);

// User Groups 
router.put('/user-groups/:userId', isAuthenticated, hasPermission("edit_group_permission"), viewAssignGroupsToUser);
router.get('/user-groups/:userId', isAuthenticated, hasPermission("view_group_permission"), viewUserGroups);
router.delete('/user-groups/:userId', isAuthenticated, hasPermission("delete_group_permission"), viewDeleteUserGroups);

export default router;