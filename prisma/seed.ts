import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {hashPassword} from "../src/Utils/hashPassword"

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1️⃣ Create Role (Super Admin)
  let superAdminRole = await prisma.role.findFirst({
    where: { code: "ADMIN" },
  });
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        code: "ADMIN",
        name: "ADMIN",
        roleType: "SYSTEM",
        description: "Super Admin have all access",
      },
    });
  }

  console.log("✅ Created Role:", superAdminRole.name);

  // 2️⃣ Create Admin Group
  const adminGroup = await prisma.group.upsert({
    where: { name: "Admin Group" },
    update: {},
    create: {
      name: "Admin Group",
      roleId: superAdminRole.id,
    },
  });

  console.log("✅ Created Group:", adminGroup.name);

  // 3️⃣ Create Permissions
  const permissionsData = [
    { codename: "view_permission", name: "view_permission" },
    { codename: "add_group", name: "add_group" },
    { codename: "view_group", name: "view_group" },
    { codename: "view_group_permission", name: "view_group_permission" },
    { codename: "edit_group_permission", name: "edit_group_permission" },
    { codename: "delete_group_permission", name: "delete_group_permission" },
    { codename: "edit_user_permission", name: "edit_user_permission" },
    { codename: "view_user_permission", name: "view_user_permission" },
    { codename: "delete_user_permission", name: "delete_user_permission" },
    { codename: "view_all_companies", name: "view_all_companies" },
    { codename: "add_company", name: "add_company" },
    { codename: "edit_company", name: "edit_company" },
    { codename: "delete_company", name: "delete_company" },
    { codename: "view_company", name: "view_company" },
    { codename: "view_company_department", name: "view_company_department" },
    { codename: "view_company_job", name: "view_company_job" },
    { codename: "view_company_apl", name: "view_company_apl" },
    { codename: "add_company_department", name: "add_company_department" },
    { codename: "edit_company_department", name: "edit_company_department" },
    { codename: "delete_company_department", name: "delete_company_department" },
    { codename: "add_company_job", name: "add_company_job" },
    { codename: "edit_company_job", name: "edit_company_job" },
    { codename: "publish_job", name: "publish_job" },
    { codename: "delete_job", name: "delete_job" },
    { codename: "edit_application_status", name: "edit_application_status" },
    { codename: "view_application_history", name: "view_application_history" },
    { codename: "add_application_note", name: "add_application_note" },
    { codename: "delete_application_note", name: "delete_application_note" },
    { codename: "add_user", name: "add_user" },
    { codename: "view_users", name: "view_users" },
    { codename: "view_user", name: "view_user" },
    { codename: "edit_users", name: "edit_users" },
    { codename: "delete_users", name: "delete_users" },
    { codename: "add_company_admin", name: "add_company_admin" },
    { codename: "edit_user_role", name: "edit_user_role" },
    { codename: "view_application_note", name: "view_application_note" },
    { codename: "view_analytics", name: "view_analytics" },
    { codename: "view_report", name: "view_report" },
    { codename: "view_assingment", name: "view_assingment" },
    { codename: "add_assingment", name: "add_assingment" },
    { codename: "edit_assingment", name: "edit_assingment" },
    { codename: "delete_assingment", name: "delete_assingment" },
    { codename: "export_roles", name: "export_roles" },
    { codename: "add_role", name: "add_role" },
    { codename: "view_role", name: "view_role" },
    { codename: "edit_role", name: "edit_role" },
    { codename: "delete_role", name: "delete_role" },
    { codename: "view_application", name: "view_application" },
    { codename: "delete_application", name: "delete_application" },
    { codename: "edit_application", name: "edit_application" },
  ];

  const permissions = [];
  for (const perm of permissionsData) {
    const created = await prisma.permission.upsert({
      where: { codename: perm.codename },
      update: {},
      create: perm,
    });
    permissions.push(created);
  }

  console.log(`✅ Created ${permissions.length} permissions.`);

  // 4️⃣ Assign Permissions to Admin Group
  await prisma.groupPermission.deleteMany({ where: { groupId: adminGroup.id } });
  for (const perm of permissions) {
    await prisma.groupPermission.create({
      data: {
        groupId: adminGroup.id,
        permissionId: perm.id,
      },
    });
  }

  console.log(`✅ Linked all permissions to Admin Group.`);

  // 5️⃣ Create Super Admin User
  const hashedPassword = await hashPassword("password");

  const superAdmin = await prisma.user.upsert({
    where: { email: "shaikhmuhid165@gmail.com" },
    update: {},
    create: {
      fullName: "Saeed Lanjekar",
      email: "shaikhmuhid165@gmail.com",
      password: hashedPassword,
      phone: "9594331924",
      roleId: superAdminRole.id,
    },
  });

  console.log("✅ Created Super Admin User:", superAdmin.email);

  // 6️⃣ Add Super Admin to Admin Group
  await prisma.groupMember.upsert({
    where: {
      userId_groupId: {
        userId: superAdmin.id,
        groupId: adminGroup.id,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      groupId: adminGroup.id,
    },
  });

  console.log("✅ Added Super Admin to Admin Group.");

  console.log("🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
