/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication related endpoints
 *
 *   - name: Admin - Users
 *     description: APIs for managing all users in the system
 *
 *   - name: Company
 *     description: endpoints for managing companies
 *
 *   - name: Company - Departments
 *     description:  Manage departments under a company
 *
 *   - name: Company - Jobs
 *     description: endpoints for managing companies jobs
 *
 *   - name: Company - Applications
 *     description: endpoints for managing companies applications
 *
 *   - name: Permissions
 *     description: Manage and view user and system permissions
 *
 *   - name: Groups
 *     description: endpoints for managing groups
 *
 *   - name: User - Permissions
 *     description: endpoints for managing user permissions
 *
 *   - name: User - Groups
 *     description: endpoints for managing user groups
 *
 *   - name: Roles
 *     description: API endpoints for managing user roles
 *
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Binary WorkData
 *         logoUrl:
 *           type: string
 *           example: ./public/temp/logo.png
 *         websiteUrl:
 *           type: string
 *           example: https://binaryworkdata.com
 *         careerPageUrl:
 *           type: string
 *           example: https://binaryworkdata.com/careers
 *         description:
 *           type: string
 *           example: A tech company focused on web hosting and AI integration.
 *         isDeleted:
 *           type: boolean
 *           example: false
 *
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Admin Group
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T10:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T10:05:00Z
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: edit_user_permission
 *         description:
 *           type: string
 *           example: Allows editing of user permissions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Admin Group
 *         description:
 *           type: string
 *           example: Group for administrators with full access
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T12:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T12:45:00Z
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         companyId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Human Resources
 *         description:
 *           type: string
 *           example: Handles employee relations and hiring
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T10:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T11:45:00Z
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         companyId:
 *           type: integer
 *         departmentId:
 *           type: string
 *         title:
 *           type: string
 *         location:
 *           type: string
 *         experience:
 *           type: string
 *         salaryRange:
 *           type: string
 *         employmentType:
 *           type: string
 *         description:
 *           type: string
 *         responsibilities:
 *           type: string
 *         requirements:
 *           type: string
 *         published:
 *           type: boolean
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         jobId:
 *           type: integer
 *         companyId:
 *           type: integer
 *         candidateName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         resumeUrl:
 *           type: string
 *         experience:
 *           type: string
 *         skills:
 *           type: string
 *         currentCTC:
 *           type: string
 *         expectedCTC:
 *           type: string
 *         noticePeriod:
 *           type: string
 *         source:
 *           type: string
 *         status:
 *           type: string
 *           enum: [APPLIED, SHORTLISTED, INTERVIEW, OFFERED, HIRED, REJECTED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         Notes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               note:
 *                 type: string
 *         History:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               oldStatus:
 *                 type: string
 *               newStatus:
 *                 type: string
 *               changeById:
 *                 type: integer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - roleType
 *       properties:
 *         name:
 *           type: string
 *           description: Display name of the role
 *           example: "HR Manager"
 *         code:
 *           type: string
 *           description: Unique short code for the role
 *           example: "HR_MGR"
 *         description:
 *           type: string
 *           description: Brief description of the role
 *           example: "Manages HR operations and employee data"
 *         roleType:
 *           type: string
 *           enum: [SYSTEM, CLIENT, STAFF, ADMIN]
 *           description: Type of the role
 *           example: "STAFF"
 *         companyId:
 *           type: string
 *           description: Optional company ID for client/staff roles
 *           example: "67102c13f9e43d3b1f9d9d91"
 *     BulkDelete:
 *       type: object
 *       required:
 *         - ids
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *             example: "670e7b2fc1a2a0e2c4e112f1"
 *           description: Array of role IDs to delete
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the user
 *           example: "670e8c41c1a2a0e2c4e115a1"
 *         fullName:
 *           type: string
 *           description: Full name of the user
 *           example: "Abdul Mueed"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "mueed@example.com"
 *         phone:
 *           type: string
 *           description: User's phone number
 *           example: "+91 9876543210"
 *         companyId:
 *           type: string
 *           nullable: true
 *           description: Company ID the user belongs to (if applicable)
 *           example: "67102c13f9e43d3b1f9d9d91"
 *         role:
 *           type: object
 *           description: Role information assigned to the user
 *           properties:
 *             code:
 *               type: string
 *               example: "ADMIN"
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the user is deleted (soft delete)
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 */

//Auth
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with full name, email and phone number.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phone
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Abdul Mueed
 *               email:
 *                 type: string
 *                 example: mueed@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or email/phone already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates user with email and password and returns access & refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: shaikhmuhid165@gmail.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves logged-in user's profile details using JWT authentication.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized or invalid token
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     description: Allows an authenticated user to update their password.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPass@123
 *               newPassword:
 *                 type: string
 *                 example: NewPass@456
 *               confirmPassword:
 *                 type: string
 *                 example: NewPass@456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid input or password mismatch
 *       401:
 *         description: Unauthorized
 */

//COMPANY
/**
 * @swagger
 * /api/company:
 *   get:
 *     summary: Get all companies
 *     description: Retrieves all non-deleted companies.
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/company:
 *   post:
 *     summary: Create a new company
 *     description: Creates a new company record. Requires authentication and an image upload for logo.
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - websiteUrl
 *               - careerPageUrl
 *               - description
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 example: Binary WorkData
 *               websiteUrl:
 *                 type: string
 *                 example: https://binaryworkdata.com
 *               careerPageUrl:
 *                 type: string
 *                 example: https://binaryworkdata.com/careers
 *               description:
 *                 type: string
 *                 example: Web hosting and AI solutions provider.
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Missing or invalid file
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate careerPageUrl found
 */

/**
 * @swagger
 * /api/company/{id}:
 *   put:
 *     summary: Update company details
 *     description: Updates the company record by ID. Requires authentication and image upload for new logo.
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *               careerPageUrl:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Missing image or invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/company/{id}:
 *   delete:
 *     summary: Soft delete a company
 *     description: Marks a company as deleted by updating its `isDeleted` field.
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/company/{companyId}:
 *   get:
 *     summary: Get company by ID
 *     description: Retrieves a single company's details by its ID, including related departments, jobs, and applications.
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/company/{companyId}/admins:
 *   post:
 *     summary: Assign admins to a company
 *     tags:
 *       - Company
 *     description: Assign one or more existing users as admins for a specific company. Requires `add_company_admin` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the company to assign admins to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - adminIds
 *             properties:
 *               roleId:
 *                 type: string
 *                 description: ID of the role to assign to the admins
 *                 example: "6710b32f7f62bca2dcb12e94"
 *               adminIds:
 *                 type: array
 *                 description: List of user IDs to assign as company admins
 *                 items:
 *                   type: string
 *                   example: "6710c945efb2a2d1f2c5e91a"
 *     responses:
 *       200:
 *         description: Company admins assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Company admins assigned successfully
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Company not found
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized – Missing or invalid token
 *       403:
 *         description: Forbidden – Missing `add_company_admin` permission
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all available permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a complete list of permissions in the system. Only users with the `view_permission` permission can access this route.
 *     responses:
 *       200:
 *         description: List of permissions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       403:
 *         description: Forbidden. User does not have permission to view this data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/permission:
 *   get:
 *     summary: Get logged-in user’s permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all unique permissions assigned directly to the logged-in user or inherited through group memberships.
 *     responses:
 *       200:
 *         description: User permissions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Permissions Retrieved
 *                 permissions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/group:
 *   post:
 *     summary: Create a new group with assigned permissions
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - permissionIds
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Recruiter Team"
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Group created and permissions assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group created and permissions assigned successfully
 *                 group:
 *                   $ref: '#/components/schemas/Group'
 */

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get permissions assigned to a specific group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of permissions in the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GroupPermission'
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update permissions for a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [4, 5, 6]
 *     responses:
 *       200:
 *         description: Group permissions updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group permissions updated successfully
 */

/**
 * @swagger
 * /api/groups/permissions/{id}:
 *   delete:
 *     summary: Delete specific permissions from a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Group permissions deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group permissions deleted successfully
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group deleted successfully
 */

/**
 * @swagger
 * /api/user-permissions/{userId}:
 *   get:
 *     summary: Get all permissions assigned to a user
 *     tags: [User - Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of permissions assigned to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/user-permissions/{userId}:
 *   put:
 *     summary: Assign or update permissions for a user
 *     tags: [User - Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               permissionIds: [1, 2, 3]
 *     responses:
 *       200:
 *         description: User permissions updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User permissions updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/user-permissions/{userId}:
 *   delete:
 *     summary: Delete specific permissions from a user
 *     tags: [User - Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               permissionIds: [2, 5]
 *     responses:
 *       200:
 *         description: User permissions deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User permissions deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/user-groups/{userId}:
 *   get:
 *     summary: Get all groups assigned to a user
 *     tags: [User - Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of groups the user belongs to
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/user-groups/{userId}:
 *   put:
 *     summary: Assign or update groups for a user
 *     tags: [User - Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               groupIds: [1, 3, 5]
 *     responses:
 *       200:
 *         description: User groups updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User groups updated
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/user-groups/{userId}:
 *   delete:
 *     summary: Remove selected groups from a user
 *     tags: [User - Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               groupIds: [2, 4]
 *     responses:
 *       200:
 *         description: Selected groups removed from user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Selected groups removed from user
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/company/{companyId}/departments/:
 *   get:
 *     summary: Get all departments for a specific company
 *     tags: [Company - Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the company
 *     responses:
 *       200:
 *         description: List of departments under the company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Company departments.
 *                 departments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/company/{companyId}/department/:
 *   post:
 *     summary: Create a new department under a company
 *     tags: [Company - Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: Human Resources
 *               description: Handles employee relations and hiring
 *     responses:
 *       200:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Department created successfully ..
 *                 department:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/company/department/{deptId}:
 *   put:
 *     summary: Update a department by its ID
 *     tags: [Company - Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deptId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: Marketing
 *               description: Responsible for company branding and outreach
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Department updated successfully ..
 *                 department:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/company/department/{deptId}:
 *   delete:
 *     summary: Soft delete a department by ID
 *     tags: [Company - Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deptId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the department to delete
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Department deleted successfully
 *       400:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /api/company/jobs/{companyId}:
 *   get:
 *     summary: Get all jobs of a company
 *     tags: [Company - Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company
 *     responses:
 *       200:
 *         description: List of jobs for the company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */

/**
 * @swagger
 * /api/company/job/{companyId}:
 *   post:
 *     summary: Create a new job for a company
 *     tags: [Company - Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentId:
 *                 type: string
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               experience:
 *                 type: string
 *               salaryRange:
 *                 type: string
 *               employmentType:
 *                 type: string
 *               description:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               requirements:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 */

/**
 * @swagger
 * /api/company/job/{jobId}:
 *   put:
 *     summary: Update an existing job
 *     tags: [Company - Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentId:
 *                 type: string
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               experience:
 *                 type: string
 *               salaryRange:
 *                 type: string
 *               employmentType:
 *                 type: string
 *               description:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               requirements:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedJob:
 *                   $ref: '#/components/schemas/Job'
 */

/**
 * @swagger
 * /api/company/job/publish/{jobId}:
 *   put:
 *     summary: Publish a job
 *     tags: [Company - Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 publishedJob:
 *                   $ref: '#/components/schemas/Job'
 */

/**
 * @swagger
 * /api/company/job/{jobId}:
 *   delete:
 *     summary: Delete (soft delete) a job
 *     tags: [Company - Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/company/application:
 *   post:
 *     summary: Submit a new job application (Open API)
 *     tags: [Company - Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: integer
 *               companyId:
 *                 type: integer
 *               candidateName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               experience:
 *                 type: string
 *               skills:
 *                 type: string
 *               currentCTC:
 *                 type: string
 *               expectedCTC:
 *                 type: string
 *               noticePeriod:
 *                 type: string
 *               source:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/company/application/{companyId}:
 *   get:
 *     summary: Get all applications of a company (Open API)
 *     tags: [Company - Applications]
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 */

/**
 * @swagger
 * /api/company/application/{applicationId}:
 *   put:
 *     summary: Change the status of an application
 *     tags: [Company - Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPLIED, SHORTLISTED, INTERVIEW, OFFERED, HIRED, REJECTED]
 *     responses:
 *       200:
 *         description: Application status changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/company/application/{applicationId}:
 *   get:
 *     summary: Get history of a specific application
 *     tags: [Company - Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oldStatus:
 *                         type: string
 *                       newStatus:
 *                         type: string
 *                       changeById:
 *                         type: integer
 */

/**
 * @swagger
 * /api/company/application/note/{applicationId}:
 *   post:
 *     summary: Add a note to an application
 *     tags: [Company - Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 applicatioNote:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     note:
 *                       type: string
 */

/**
 * @swagger
 * /api/company/application/note/{noteId}:
 *   delete:
 *     summary: Delete a note from an application
 *     tags: [Company - Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: noteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/roles/export:
 *   get:
 *     summary: Export all roles to Excel file
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file downloaded successfully
 */

/**
 * @swagger
 * /api/roles/role:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Role"
 *     responses:
 *       201:
 *         description: Role created successfully
 */

/**
 * @swagger
 * /api/roles/search:
 *   get:
 *     summary: Search roles by name, code, or role type
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term (code/name/roleType)
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: Filter by company ID
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update an existing role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Role"
 *     responses:
 *       200:
 *         description: Role updated successfully
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles with pagination and filters
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: roleType
 *         schema:
 *           type: string
 *           enum: [SYSTEM, CLIENT, STAFF, ADMIN]
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role details retrieved successfully
 *       404:
 *         description: Role not found
 */

/**
 * @swagger
 * /api/roles/bulk:
 *   delete:
 *     summary: Bulk delete roles (soft delete)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BulkDelete"
 *     responses:
 *       200:
 *         description: Roles deleted successfully
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a single role by ID (soft delete)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully
 */

/**
 * @swagger
 * /api/roles/import:
 *   post:
 *     summary: Import roles from an Excel/CSV file
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Roles imported successfully
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin - Users]
 *     description: Retrieve a paginated list of all active (non-deleted) users in the system. Requires `view_users` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of users to fetch per page
 *     responses:
 *       200:
 *         description: Successfully fetched paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalItems:
 *                   type: integer
 *                   example: 47
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "67102c13f9e43d3b1f9d9d91"
 *                       fullName:
 *                         type: string
 *                         example: "Abdul Mueed"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "mueed@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+91 9876543210"
 *                       companyId:
 *                         type: string
 *                         example: "670f2a92e4e8ab2b57e45f11"
 *                       Role:
 *                         type: object
 *                         properties:
 *                           code:
 *                             type: string
 *                             example: "ADMIN"
 *       404:
 *         description: No users found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden – Missing `view_users` permission
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Returns a single user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *
 *   put:
 *     summary: Update user by ID
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Updated User"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               phone:
 *                 type: string
 *                 example: "+91 9999999999"
 *               companyId:
 *                 type: string
 *                 example: "67102c13f9e43d3b1f9d9d91"
 *     responses:
 *       200:
 *         description: User updated successfully
 *
 *   delete:
 *     summary: Soft delete user by ID
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
