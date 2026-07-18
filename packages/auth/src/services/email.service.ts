import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: "noreply@codingthecode.site",
    to: [to],
    subject,
    text,
  });

  if (error) {
    console.log("Error sending the email", error);
    return;
  }

  console.log("Data: ", data);
  console.log("Email got sent successfully");
};
