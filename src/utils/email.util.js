import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import ApiError from "./api-error.js";

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Blogify",
            link: "https://mailgen.js/",
        },
    });

    let emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    let emailHtml = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, 
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: '"Blogify" <noreply@blogify.com>',
            to: options.email,
            subject: options.subject,
            text: emailText,
            html: emailHtml,
        });
    
    }
    catch(error) {
        throw new ApiError(404,"Error during sending mail",error)
    }
}

const emailVerificationMailGenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Blogify! We're very excited to have you on board.",
            action: {
                instructions: "To get started with Blogify, please click here:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Confirm your account",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};


const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset your password",
            action: {
                instructions: "To change your password click the button",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Reset password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};


export {sendMail,emailVerificationMailGenContent,forgotPasswordMailGenContent}