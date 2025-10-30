import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWTSECRET = process.env.JWTSECRET || "uifgv2345#%^67%ZXFHGF5#$@ghF2376UF^&%v";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "gfuyFGJH&*%$%^#dfhgFU^*erdf1473";
export const E_USER = process.env.EMAIL_USER!;
export const E_PASS = process.env.EMAIL_PASS!;
export const COMPANY_TOKEN_SECRET = process.env.JWT_SECRET!;

