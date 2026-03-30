import nodemailer from "nodemailer";
import fs from "fs";

const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  host: config.MAILHOST,
  port: config.MAILPORT,
  auth: {
    user: config.MAILUSER,
    pass: config.MAILPASSWORD,
  },
});

export default defineEventHandler(async (event) => {
  try {
    console.log("Starting to parse form...");
    const { IncomingForm } = await import("formidable");
    const form = new IncomingForm({ multiples: true });

    const body = await readBody(event);

    // Используем node.req вместо event.req
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          reject(err);
        } else {
          console.log("Form parsed successfully:", fields, files);
          resolve({ fields, files });
        }
      });
    });

    // Извлечение и проверка полей формы
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;

    // if (!name || !email || !phone || !description) {
    //   throw new Error("Missing required form fields");
    // }

    let attachments = [];

    if (files.file) {
      console.log("Processing attachments...");
      const filearr = Array.isArray(files.file) ? files.file : [files.file];
      const file = filearr[0];
      if (file && file.filepath) {
        // Чтение файла синхронно
        let fileContent = fs.readFileSync(file.filepath);

        // Убедимся, что fileContent не является массивом (если так, преобразуем в Buffer)
        if (Array.isArray(fileContent)) {
          fileContent = Buffer.concat(fileContent); // Преобразуем массив в Buffer
        }

        attachments.push({
          filename: file.originalFilename,
          content: fileContent, // Используем содержимое файла (Buffer)
        });
        console.log("Attachment processed successfully");
      }
    }

    const mail = {
      from: `"${name}" <${email}>`,
      to: config.CONTACTMAIL,
      subject: name,
      text: description,
      html: `
        / Имя / ${name} <br>
        / Телефон / ${phone} <br>
        / Email / ${email} <br>
        / Текст отзыва / ${description} <br>
      `,
      attachments,
    };

    console.log("Sending mail...");
    await transporter.sendMail(mail);
    console.log("Mail sent successfully");
  } catch (error) {
    console.error("Error occurred:", error.message);
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: error.message,
      }),
    );
  }
});
