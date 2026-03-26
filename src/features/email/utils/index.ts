import { sendAcceptBidMail, sendAcceptDnMail, sendBidMail, sendDnMail } from "../sendMail";

export const docMailMap = {
  BID: sendBidMail,
  DEN: sendDnMail,
  CON: sendBidMail,
  INV: sendBidMail,
  CUS: sendBidMail,
}

export const acceptDocMailMap = {
  BID: sendAcceptBidMail,
  DEN: sendAcceptDnMail,
  CON: sendAcceptBidMail,
  INV: sendAcceptBidMail,
  CUS: sendAcceptBidMail,
}