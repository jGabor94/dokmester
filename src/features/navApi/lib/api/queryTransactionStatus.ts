import { Builder, Parser, processors } from "xml2js";
import { createRequestSignature, decrypt, genRequestId, getTimestamp } from "../../utils";
import { software } from "../constants";
import { SelectNavData } from "../types";


const queryTransactionStatus = async ({
  authData,
  taxNumber,
  transactionId,
  returnOriginalRequest
}: { authData: SelectNavData, taxNumber: string, transactionId: string, returnOriginalRequest?: boolean }) => {

  const requestId = genRequestId()
  const builder = new Builder()
  const parser = new Parser({ tagNameProcessors: [processors.stripPrefix] })

  const xmlRequest = builder.buildObject({
    "QueryTransactionStatusRequest": {
      "$": {
        "xmlns": "http://schemas.nav.gov.hu/OSA/3.0/api",
        "xmlns:common": "http://schemas.nav.gov.hu/NTCA/1.0/common"
      },
      "common:header": {
        "common:requestId": requestId,
        "common:timestamp": getTimestamp(),
        "common:requestVersion": "3.0",
        "common:headerVersion": "1.0"
      },
      "common:user": {
        "common:login": authData.userName,
        "common:passwordHash": {
          "$": { "cryptoType": "SHA-512" },
          "_": authData.password
        },
        "common:taxNumber": taxNumber.split("-")[0],
        "common:requestSignature": {
          "$": { "cryptoType": "SHA3-512" },
          "_": createRequestSignature({
            requestId,
            signatureKey: decrypt(authData.signatureKey),
          })
        }
      },
      "software": software,
      "transactionId": transactionId,
      "returnOriginalRequest": returnOriginalRequest || false
    }
  });

  const res = await fetch("https://api-test.onlineszamla.nav.gov.hu/invoiceService/v3/queryTransactionStatus", {
    method: "POST",
    headers: {
      "content-type": "application/xml",
      "accept": "application/xml"
    },
    body: xmlRequest
  })

  const xmlResponse = await res.text()
  const objResponse = await parser.parseStringPromise(xmlResponse)

  if (objResponse.GeneralErrorResponse && objResponse.GeneralErrorResponse.result[0].funcCode[0] === "ERROR") {
    throw new Error(objResponse.GeneralErrorResponse.result[0].message[0])
  }


  return {
    xmlResponse,
    objResponse,
    xmlRequest,
    originalRequest: Buffer.from(objResponse.QueryTransactionStatusResponse.processingResults[0].processingResult[0].originalRequest[0], 'base64').toString()
  }


}

export default queryTransactionStatus