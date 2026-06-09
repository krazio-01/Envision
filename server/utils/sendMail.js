import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deliverSmtpEmail = async (userEmail, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: process.env.SECURE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });

        const mail_configs = {
            from: `"Envision" <${process.env.USER}>`,
            to: userEmail,
            subject: subject,
            text: text,
            html: html,
        };

        await transporter.sendMail(mail_configs);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendEmail = async (to, subject, templateFilename, variables = {}) => {
    try {
        const templatePath = path.join(__dirname, '..', 'templates', templateFilename);
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        variables['year'] = new Date().getFullYear().toString();

        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(regex, value);
        }

        await deliverSmtpEmail(to, subject, '', htmlContent);
    } catch (error) {
        console.error(`Failed to process email template ${templateFilename}:`, error);
        throw error;
    }
};

export default sendEmail;
