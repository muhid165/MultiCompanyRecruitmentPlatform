import { transporter } from "../Utils/emaiTransporter";

export const sendEmail = async (
  email: string,
  fullName: string,
  password: string
) => {
  await transporter.sendMail({
    // from: "mueed072003@gmail.com",
    to: email,
    subject: `Welcome to Recruitment CMS-V1 Portal`,
    text: `Hello ${fullName},
    
    An account has been created for you on our Recruitment Management System.
    
    Login Credentials:
    Email: ${email}
    Password: ${password}
    
    Please change your password after first login.
    `,
  });
};
