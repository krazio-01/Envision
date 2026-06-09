import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: process.env.SECURE === 'true',
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });
    }
    return transporter;
};

const deliverSmtpEmail = async (userEmail, subject, text, html) => {
    const mailer = getTransporter();

    const mail_configs = {
        from: `"Envision" <${process.env.USER}>`,
        to: userEmail,
        subject: subject,
        text: text,
        html: html,
    };

    await mailer.sendMail(mail_configs);
};

const sendEmail = async (to, subject, templateFilename, variables = {}) => {
    try {
        const templatePath = path.join(__dirname, '..', 'templates', templateFilename);
        let htmlContent = await fs.readFile(templatePath, 'utf8');

        const templateData = {
            ...variables,
            year: new Date().getFullYear().toString()
        };

        htmlContent = htmlContent.replace(/{{(.*?)}}/g, (match, variableName) => {
            const trimmedKey = variableName.trim();
            return trimmedKey in templateData ? templateData[trimmedKey] : match;
        });

        await deliverSmtpEmail(to, subject, '', htmlContent);
    } catch (error) {
        console.error(`Failed to process email template ${templateFilename}:`, error);
        throw error;
    }
};

export default sendEmail;
