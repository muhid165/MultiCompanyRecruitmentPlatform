import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Config/swagger";
import authRoutes from "./api/Routes/auth";
import companyRoutes from "./api/Routes/company";
import departmentRoutes from "./api/Routes/department";
import jobRoutes from "./api/Routes/job";
import applicationRoutes from "./api/Routes/application";
import userRoutes from "./api/Routes/users";
import permissionRoutes from "./api/Routes/permission";
import roleRoutes from "./api/Routes/role";
import analyticsRoutes from "./api/Routes/analytics"
import reportRoutes from "./api/Routes/report"
import assignmentRoutes from "./api/Routes/assignment"
import { errorHandler } from "./Utils/errorHandler";  
import path from "path";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*", // for dev only
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
  })
);
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/files", express.static(path.join("D:/PRODUCTS/cms-backend/public/temp")));

app.use("/api/auth", authRoutes); 
app.use("/api/company", companyRoutes); 
app.use("/api/department", departmentRoutes); 
app.use("/api/job", jobRoutes); 
app.use("/api/application", applicationRoutes); 
app.use("/api/", permissionRoutes); 
app.use("/api/user", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/assignment", assignmentRoutes);

app.use(errorHandler);
export default app;
