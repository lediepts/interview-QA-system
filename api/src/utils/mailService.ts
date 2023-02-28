import sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";
import { randomStr } from ".";
dotenv.config();
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

class MailService {
  private subject: string;
  private html: string;
  constructor(subject?: string, html?: string) {
    this.subject = subject || "[API-SERVICE]";
    this.html = html || "=========api-service==========";
  }

  async sendPassCode(email: string) {
    const code = randomStr({
      length: 6,
      number: true,
    });
    console.log({ code });
    // this.send(email, {
    //   html: `<h1>Pass code: ${code}</h1>`,
    // });
    return code;
  }
  async send(
    to: string,
    { html, subject }: { subject?: string; html?: string }
  ) {
    const from = {
      email: `${process.env.SENDGRID_MAIL_FROM}`,
      name: `${process.env.SENDGRID_MAIL_NAME}`,
    };
    const body = {
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
        },
      ],
      from,
      subject: subject || this.subject,
      content: [
        {
          type: "text/html",
          value:
            "<div>" + html
              ? html
              : this.html +
                "</div>" +
                `<div style="margin-top: 50px">
          <p>----------------------------------------------------</p>
          <div
          style="
              width: max-content;
              padding: 10px;
            "
          >
            <p>***API-Service***</p>
          </div>
          <p>----------------------------------------------------</p>
        </div>
      `,
        },
      ],
    } as any;
    if (!to.includes("@")) {
      console.error("MailService>>Send>>To: not email", to);
      return;
    }
    try {
      await sgMail.send(body);
      console.info("Sended", { to });
    } catch (error) {
      console.error("MailService>>Send>>", (error as any).response.body);
    }
  }
}
export default MailService;
