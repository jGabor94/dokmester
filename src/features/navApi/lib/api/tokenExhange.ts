import { Builder, Parser, processors } from "xml2js";
import { createRequestSignature, decrypt, decryptExchnageToken, genRequestId, getTimestamp } from "../../utils";
import { software } from "../constants";
import { SelectNavData } from "../types";


const tokenExhange = async ({ authData, taxNumber }: { authData: SelectNavData, taxNumber: string }) => {

  const requestId = genRequestId()
  const builder = new Builder()
  const parser = new Parser({ tagNameProcessors: [processors.stripPrefix] })

  const xmlRequest = builder.buildObject({
    "TokenExchangeRequest": {
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
      "software": software
    }
  });

  const res = await fetch("https://api-test.onlineszamla.nav.gov.hu/invoiceService/v3/tokenExchange", {
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
    token: decryptExchnageToken(objResponse.TokenExchangeResponse.encodedExchangeToken[0] as string, decrypt(authData.exchangeKey))
  }


}

export default tokenExhange