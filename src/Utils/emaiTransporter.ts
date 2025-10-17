import nodemailer from "nodemailer";
import { E_USER, E_PASS } from "../Config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: E_USER,
    pass: E_PASS,
  },
});
