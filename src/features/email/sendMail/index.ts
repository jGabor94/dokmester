import { SelectDocument } from "@/features/documents/lib/types/document";
import { SelectInvoice } from "@/features/invoice/lib/types";
import { SelectUser } from "@/features/user/utils/types";
import { render } from "@react-email/render";
import nodemailer from 'nodemailer';
import { AcceptDocument } from "../templates/AcceptDocument";
import { DeletedCompany } from "../templates/DeletedCompany";
import { InviteUser } from "../templates/InviteUser";
import { NewBidEmail } from "../templates/NewBid";
import { NewDnMail } from "../templates/NewDn";
import NewInvoiceMail from "../templates/NewInvoiceMail";
import { PasswordReset } from "../templates/PasswordReset";
import { VerifyEmail } from "../templates/Verify";
import { options } from "../utils/nodemailer";

export const sendVerifyCode = async (to: string, name: string, code: number) => {

  const transporter = nodemailer.createTransport(options);

  const html = await render(VerifyEmail({
    name,
    code
  }), {
    pretty: true,
  });

  await transporter.sendMail({
    from: 'DokMester <info@dokmester.com>',
    to,
    subject: '📧 E-mail cím megerősítése!',
    html,
  });

}

export const sendPasswordReset = async (email: string, name: string, userID: string) => {

  const transporter = nodemailer.createTransport(options);

  const html = await render(PasswordReset({
    name,
    email,
    userID
  }), {
    pretty: true,
  });

  await transporter.sendMail({
    from: 'DokMester <info@dokmester.com>',
    to: email,
    subject: '🔐 Jelszó helyreállítás!',
    html,
  });

}

export const sendBidMail = async (doc: SelectDocument, file: Blob, customHtml?: string) => {

  const transporter = nodemailer.createTransport(options);

  const html = await render(NewBidEmail(doc, customHtml), {
    pretty: true,
  });


  await transporter.sendMail({
    from: `${doc.data.issuer.name} <info@dokmester.com>`,
    to: doc.data.applicant.email,
    subject: '📕 Új árajánlat érkezett!',
    html,
    attachments: [{
      filename: `Árajánlat - ${doc.data.applicant.name}.pdf`,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: 'application/pdf'
    }]
  })
}

export const sendAcceptBidMail = async (doc: SelectDocument) => {

  const transporter = nodemailer.createTransport(options);

  const html = await render(AcceptDocument({
    issuerName: doc.data.issuer.name,
    docName: doc.name,
    docType: doc.type,
    docCreated: doc.createdAt,
  }), {
    pretty: true,
  });

  await transporter.sendMail({
    from: 'DokMester <info@dokmester.com>',
    to: doc.data.issuer.email,
    subject: '✅ Árajánlat elfogadva!',
    html,
  });
}


export const sendAcceptDnMail = async (doc: SelectDocument) => {

  const transporter = nodemailer.createTransport(options);

  const html = await render(AcceptDocument({
    issuerName: doc.data.issuer.name,
    docName: doc.name,
    docType: doc.type,
    docCreated: doc.createdAt,
  }), {
    pretty: true,
  });

  await transporter.sendMail({
    from: 'DokMester <info@dokmester.com>',
    to: doc.data.issuer.email,
    subject: '✅ Szállítólevél elfogadva!',
    html,
  });
}




export const sendDnMail = async (doc: SelectDocument, file: Blob, customHtml?: string) => {

  const transporter = nodemailer.createTransport(options);

  const html = await render(NewDnMail(doc, customHtml), {
    pretty: true,
  });

  await transporter.sendMail({
    from: `${doc.data.issuer.name} <info@dokmester.com>`,
    to: doc.data.applicant.email,
    subject: '📗 Új szállítólevél érkezett!',
    html,
    attachments: [{
      filename: `Szállítólevél - ${doc.data.applicant.name}.pdf`,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: 'application/pdf'
    }]
  })
}

export const sendInvoiceMail = async (invoice: SelectInvoice, file: Blob, customHtml?: string) => {

  const transporter = nodemailer.createTransport(options);

  const html = await render(NewInvoiceMail(invoice, customHtml), {
    pretty: true,
  });

  await transporter.sendMail({
    from: `${invoice.data.supplier.name} <info@dokmester.com>`,
    to: invoice.data.customer.email,
    subject: '📗 Új számla érkezett!',
    html,
    attachments: [{
      filename: `Számla - ${invoice.name}.pdf`,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: 'application/pdf'
    }]
  })
}


export const sendDeletedCompanyMail = async (user: SelectUser, companyName: string) => {

  const transporter = nodemailer.createTransport(options);

  const html = await render(DeletedCompany(user.name, companyName), {
    pretty: true,
  });

  await transporter.sendMail({
    from: 'DokMester <info@dokmester.com>',
    to: user.email,
    subject: '😔 Tájékoztató cég megszűnésről!',
    html,
  })
}

export const sendInviteMail = async (to: string, companyName: string, inviteID: string) => {

  const transporter = nodemailer.createTransport(options);
  const html = await render(InviteUser({ companyName, inviteID }), { pretty: true });

  await transporter.sendMail({
    from: 'DokMester <info@dokmester.com>',
    to,
    subject: `🎊 ${companyName} - meghívás!`,
    html,
  })
}
