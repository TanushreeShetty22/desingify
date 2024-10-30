import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL;

// Configure the transporter with your SMTP credentials
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.BREVO_AUTH_USER, 
    pass: process.env.BREVO_AUTH_PASSWORD,
  },
});

export const sendTwoFactorTokenEmail = async (email:string, token:string) => {
  await transporter.sendMail({
    from: '"Your App Name" <onboarding@yourdomain.com>', // sender address
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email:string, token:string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await transporter.sendMail({
    from: '"Your App Name" <onboarding@yourdomain.com>',
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

export const sendVerificationEmail = async (email:string, token:string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await transporter.sendMail({
    from: '"Your App Name" <onboarding@yourdomain.com>',
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  });
};
