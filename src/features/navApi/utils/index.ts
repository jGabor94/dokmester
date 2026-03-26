"server-only"

import { KAFAValues, vatExemptionValues, vatOutOfScopeValues, vatPercentageValues, vatRatesMap } from "@/features/items/lib/contants";
import { VatKey } from "@/features/items/utils/types";
import crypto from "crypto";
import { naturalUnits } from "../lib/constants";
import { InvoiceData, InvoiceOperation } from "../lib/types";

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(process.env.CRYPTO_SECRET_KEY as string), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export const decrypt = (text: string) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(process.env.CRYPTO_SECRET_KEY as string), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
}

export const createRequestSignature = (
  { requestId, signatureKey, invoiceOperations }:
    { requestId: string, signatureKey: string, invoiceOperations?: InvoiceOperation[] }) => {
  // 1. Parciális hitelesítés
  const formattedTimestamp = getMaskedCurrentTime(); // YYYYMMDDhhmmss
  const partialSignature = `${requestId}${formattedTimestamp}${signatureKey}`;
  if (!invoiceOperations) return crypto.createHash("sha3-512").update(partialSignature).digest("hex").toUpperCase();

  // 2. Index hash-ek számítása
  const indexHashes = invoiceOperations.map(({ operation, data }) => {
    const hashBase = `${operation}${data}`;
    return crypto.createHash("sha3-512").update(hashBase).digest("hex").toUpperCase();
  });

  // 3. requestSignature kiszámítása
  const fullSignatureBase = partialSignature + indexHashes.join("");
  const requestSignature = crypto.createHash("sha3-512").update(fullSignatureBase).digest("hex").toUpperCase();

  return requestSignature
}

export const decryptExchnageToken = (encodedToken: string, exchangeKey: string) => {

  const encryptedBuffer = Buffer.from(encodedToken, 'base64');

  const keyBuffer = Buffer.from(exchangeKey, 'utf8');


  const decipher = crypto.createDecipheriv('aes-128-ecb', keyBuffer, null);
  decipher.setAutoPadding(true);

  const decrypted = decipher.update(encryptedBuffer, undefined, 'utf8');

  return decrypted + decipher.final('utf8')

}

export const getTimestamp = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localOffset = (offset === -60 ? 1 : 2) * 60;
  now.setMinutes(now.getMinutes() + localOffset);
  return now.toISOString();
};

export const getMaskedCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 mert a hónapok 0-tól kezdődnek
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export const genRequestId = () => `${Date.now()}${Math.random().toString(36).substring(2, 10)}`

/**
 * 
 * @returns YYYY-MM-DD formátum
 */
export const getDate = () => new Date().toISOString().split("T")[0]

export const isNaturalUnit = (unit: string) => naturalUnits.includes(unit.replace(/^[\d\s]+/, ""));

export const getVatStatus = (customer: InvoiceData["customer"]) => {
  if (customer.countryCode !== "HU") return "OTHER"
  if (customer.taxnumber) return "DOMESTIC"
  if (customer.communityVatNumber) return "OTHER"
  return "PRIVATE_PERSON"
}

export const getVatRate = (vatKey: VatKey) => {
  if (vatPercentageValues.includes(vatKey as typeof vatPercentageValues[number])) {
    return { "vatPercentage": vatRatesMap[vatKey].vatValue }
  } else if (vatExemptionValues.includes(vatKey as typeof vatExemptionValues[number])) {
    return {
      "vatExemption": {
        "case": vatKey,
        "reason": vatRatesMap[vatKey].reason
      }
    }
  } else if (vatOutOfScopeValues.includes(vatKey as typeof vatOutOfScopeValues[number])) {
    return {
      "vatOutOfScope": {
        "case": vatKey,
        "reason": vatRatesMap[vatKey].reason
      }
    }
  } else if (KAFAValues.includes(vatKey as typeof KAFAValues[number])) {
    return { "marginSchemeIndicator": vatKey.split(" ")[1] }
  } else {
    return { "vatDomesticReverseCharge": true }
  }
}

