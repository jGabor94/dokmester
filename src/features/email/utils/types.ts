export interface WelcomeType {
  name: string,
}

export interface NewBidType {
  name: string,
  companyName: string,
  companyZip?: number,
  companyCity: string,
  companyAddress: string,
  companyTaxnumber: string,
  docID?: string,
  customHtml?: string
}

export interface NewDnType {
  name: string,
  companyName: string,
  companyZip?: number,
  companyCity: string,
  companyAddress: string,
  companyTaxnumber: string,
  docID?: string,
  customHtml?: string
}


export interface EmailVerifyType {
  code: number;
  name: string;
}

export interface AcceptedDocumentType {
  issuerName: string;
  docName: string
  docType: string,
  docCreated: Date,
}

export interface InviteUserType {
  companyName: string,
  inviteID: string
}

export interface PasswordResetType {
  email: string;
  name: string;
  userID: string;
}