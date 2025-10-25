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

export const sendApplicationMail = async (
  email: string,
  candidateName: string,
  companyName: string
) => {
  await transporter.sendMail({
    // from: "mueed072003@gmail.com",
    to: email,
    subject: `Welcome to `,
    text: `Hi ${candidateName},
    
    Thank you for applying at ${companyName}.
    
    We have received your application and our recruitment team will review your profile shortly.  
    If your qualifications match our requirements, we will get in touch with you for the next steps in the process.

    What happens next?
    - Our hiring team will review your application.
    - If shortlisted, you will hear from us within [X] days.
    - If not selected, we will still inform you via email.

    In the meantime, feel free to reach out if you have any questions.
    
    Best regards,  
    HR Department
    ${companyName}.
    `,
  });
};
