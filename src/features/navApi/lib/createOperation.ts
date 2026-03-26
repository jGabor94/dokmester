import { vatRatesMap } from "@/features/items/lib/contants"
import { VatKey, VatRate } from "@/features/items/utils/types"
import { Builder } from "xml2js"
import { getDate, getVatRate, getVatStatus, isNaturalUnit } from "../utils"
import { InvoiceOperationData } from "./types"



export const createOperation = (data: InvoiceOperationData) => {

  const builder = new Builder()

  const issueDate = getDate()
  const customerVatStatus = getVatStatus(data.customer)


  const summary = data.lines.reduce((acc, line) => {
    if (acc[line.vatkey]) {
      return {
        ...acc, [line.vatkey]: {
          ...acc[line.vatkey],
          price: line.quantity * line.unitPrice + acc[line.vatkey].price,
        }
      }
    }

    return {
      ...acc, [line.vatkey]: {
        vatkey: line.vatkey,
        vatValue: vatRatesMap[line.vatkey].vatValue,
        price: line.quantity * line.unitPrice,
      }
    }
  }, {} as Record<VatRate["value"], { vatkey: VatKey, price: number, vatValue: number }>)

  const xmlRequest = builder.buildObject({
    "InvoiceData": {
      "$": {
        "xmlns": "http://schemas.nav.gov.hu/OSA/3.0/data",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:schemaLocation": "http://schemas.nav.gov.hu/OSA/3.0/data invoiceData.xsd",
        "xmlns:common": "http://schemas.nav.gov.hu/NTCA/1.0/common",
        "xmlns:base": "http://schemas.nav.gov.hu/OSA/3.0/base"
      },
      "invoiceNumber": data.serialNumber,
      "invoiceIssueDate": issueDate,
      "completenessIndicator": false,
      "invoiceMain": {
        "invoice": {
          ...data.invoiceReference && {
            "invoiceReference": {
              "originalInvoiceNumber": data.invoiceReference.originalInvoiceNumber,
              "modifyWithoutMaster": false,
              "modificationIndex": data.invoiceReference.modificationIndex,
            }
          },
          "invoiceHead": {
            "supplierInfo": {
              supplierTaxNumber: {
                "base:taxpayerId": data.supplier.taxnumber.split("-")[0],
                "base:vatCode": data.supplier.taxnumber.split("-")[1],
                "base:countyCode": data.supplier.taxnumber.split("-")[2],
              },
              ...data.supplier.groupMemberTaxNumber && {
                "groupMemberTaxNumber": {
                  "base:taxpayerId": data.supplier.taxnumber.split("-")[0],
                  "base:vatCode": data.supplier.taxnumber.split("-")[1],
                  "base:countyCode": data.supplier.taxnumber.split("-")[2],
                }
              },
              ...data.supplier.communityVatNumber && {
                "communityVatNumber": data.supplier.communityVatNumber
              },
              "supplierName": data.supplier.name,
              "supplierAddress": {
                "base:simpleAddress": {
                  "base:countryCode": data.supplier.countryCode,
                  "base:postalCode": data.supplier.zip,
                  "base:city": data.supplier.city,
                  ...data.supplier.address && { "base:additionalAddressDetail": data.supplier.address },
                }
              },
              ...data.supplier.bankAccountNumber && { "supplierBankAccountNumber": data.supplier.bankAccountNumber }
            },
            "customerInfo": {
              "customerVatStatus": customerVatStatus,
              "customerVatData": {
                ...data.customer.taxnumber && {
                  "customerTaxNumber": {
                    "base:taxpayerId": data.customer.taxnumber.split("-")[0],
                    "base:vatCode": data.customer.taxnumber.split("-")[1],
                    "base:countyCode": data.customer.taxnumber.split("-")[2],
                  },
                  ...data.customer.groupMemberTaxNumber && {
                    "groupMemberTaxNumber": {
                      "base:taxpayerId": data.customer.groupMemberTaxNumber.split("-")[0],
                      "base:vatCode": data.customer.groupMemberTaxNumber.split("-")[1],
                      "base:countyCode": data.customer.groupMemberTaxNumber.split("-")[2],
                    }
                  }
                },
                ...data.customer.communityVatNumber && !data.customer.taxnumber && {
                  "communityVatNumber": data.customer.communityVatNumber
                },
              },
              ...customerVatStatus !== "PRIVATE_PERSON" && {
                "customerName": data.customer.name,
                "customerAddress": {
                  "base:simpleAddress": {
                    "base:countryCode": data.customer.countryCode,
                    "base:postalCode": data.customer.zip,
                    "base:city": data.customer.city,
                    ...data.customer.address && { "base:additionalAddressDetail": data.customer.address },
                  }
                }
              }

            },
            "invoiceDetail": {
              "invoiceCategory": data.invoiceDetail.category || "NORMAL",
              "invoiceDeliveryDate": data.invoiceDetail.deliveryDate || issueDate,
              ...data.invoiceDetail.invoiceDeliveryPeriodStart && { "invoiceDeliveryPeriodStart": data.invoiceDetail.invoiceDeliveryPeriodStart },
              ...data.invoiceDetail.invoiceDeliveryPeriodEnd && { "invoiceDeliveryPeriodEnd": data.invoiceDetail.invoiceDeliveryPeriodEnd },
              ...data.invoiceDetail.invoiceAccountingDeliveryDate && { "invoiceAccountingDeliveryDate": data.invoiceDetail.invoiceAccountingDeliveryDate },
              ...data.invoiceDetail.periodicalSettlement && { "periodicalSettlement": data.invoiceDetail.periodicalSettlement },
              ...data.invoiceDetail.smallBusinessIndicator && { "smallBusinessIndicator": data.invoiceDetail.smallBusinessIndicator },
              "currencyCode": data.invoiceDetail.currencyCode,
              "exchangeRate": data.invoiceDetail.exchangeRate,
              ...data.invoiceDetail.utilitySettlementIndicator && { "utilitySettlementIndicator": data.invoiceDetail.utilitySettlementIndicator },
              ...data.invoiceDetail.selfBillingIndicator && { "selfBillingIndicator": data.invoiceDetail.selfBillingIndicator },
              ...data.invoiceDetail.paymentMethod && { "paymentMethod": data.invoiceDetail.paymentMethod },
              ...data.invoiceDetail.paymentDate && { "paymentDate": data.invoiceDetail.paymentDate },
              ...data.invoiceDetail.cashAccountingIndicator && { "cashAccountingIndicator": data.invoiceDetail.cashAccountingIndicator },
              invoiceAppearance: data.invoiceDetail.invoiceAppearance || "PAPER",
              ...data.invoiceDetail.conventionalInvoiceInfo && { "conventionalInvoiceInfo": data.invoiceDetail.conventionalInvoiceInfo },
              ...data.invoiceDetail.additionalInvoiceData && { "additionalInvoiceData": data.invoiceDetail.additionalInvoiceData },
            }
          },
          "invoiceLines": {
            "mergedItemIndicator": false,
            "line": data.lines.map((line, index) => ({
              "lineNumber": index + 1,
              ...data.invoiceReference && {
                "lineModificationReference": {
                  "lineNumberReference": data.invoiceReference.itemsNumber + index + 1,
                  "lineOperation": "CREATE"
                }
              },
              "lineExpressionIndicator": isNaturalUnit(line.unit),
              "lineNatureIndicator": line.type,
              "lineDescription": line.name,
              "quantity": line.quantity,
              "unitOfMeasure": "OWN",
              "unitOfMeasureOwn": line.unit,
              "unitPrice": line.unitPrice,
              "unitPriceHUF": line.unitPrice * data.invoiceDetail.exchangeRate,
              "lineAmountsNormal": {
                "lineNetAmountData": {
                  "lineNetAmount": line.unitPrice * line.quantity,
                  "lineNetAmountHUF": line.unitPrice * line.quantity * data.invoiceDetail.exchangeRate
                },
                "lineVatRate": getVatRate(line.vatkey),
                "lineVatData": {
                  "lineVatAmount": line.unitPrice * line.quantity * vatRatesMap[line.vatkey].vatValue,
                  "lineVatAmountHUF": line.unitPrice * line.quantity * vatRatesMap[line.vatkey].vatValue * data.invoiceDetail.exchangeRate
                },
                "lineGrossAmountData": {
                  "lineGrossAmountNormal": line.unitPrice * line.quantity * (1 + vatRatesMap[line.vatkey].vatValue),
                  "lineGrossAmountNormalHUF": line.unitPrice * line.quantity * (1 + vatRatesMap[line.vatkey].vatValue) * data.invoiceDetail.exchangeRate
                }
              },
              ...line.intermediatedService && { "intermediatedService": line.intermediatedService },
              ...line.aggregateData && { "aggregateInvoiceLineData": line.aggregateData },
            }))
          },
          "invoiceSummary": {
            "summaryNormal": {
              "summaryByVatRate": Object.entries(summary).map(([_, item]) => ({
                "vatRate": getVatRate(item.vatkey),
                "vatRateNetData": {
                  "vatRateNetAmount": item.price,
                  "vatRateNetAmountHUF": item.price * data.invoiceDetail.exchangeRate
                },
                "vatRateVatData": {
                  "vatRateVatAmount": item.price * item.vatValue,
                  "vatRateVatAmountHUF": item.price * item.vatValue * data.invoiceDetail.exchangeRate
                },
                "vatRateGrossData": {
                  "vatRateGrossAmount": item.price * (1 + item.vatValue),
                  "vatRateGrossAmountHUF": item.price * (1 + item.vatValue) * data.invoiceDetail.exchangeRate
                }
              })),
              "invoiceNetAmount": data.lines.reduce((acc, line) => acc + line.unitPrice * line.quantity, 0),
              "invoiceNetAmountHUF": data.lines.reduce((acc, line) => acc + line.unitPrice * line.quantity, 0) * data.invoiceDetail.exchangeRate,
              "invoiceVatAmount": data.lines.reduce((acc, line) => acc + line.unitPrice * line.quantity * vatRatesMap[line.vatkey].vatValue, 0),
              "invoiceVatAmountHUF": data.lines.reduce((acc, line) => acc + line.unitPrice * line.quantity * vatRatesMap[line.vatkey].vatValue, 0) * data.invoiceDetail.exchangeRate,
            },
            "summaryGrossData": {
              "invoiceGrossAmount": data.lines.reduce((acc, line) => acc + line.unitPrice * line.quantity * (1 + vatRatesMap[line.vatkey].vatValue), 0),
              "invoiceGrossAmountHUF": data.lines.reduce((acc, line) => acc + line.unitPrice * line.quantity * (1 + vatRatesMap[line.vatkey].vatValue), 0) * data.invoiceDetail.exchangeRate,
            }
          },

        }
      }
    }
  })

  console.log({ xmlRequest })


  return Buffer.from(xmlRequest, 'utf8').toString('base64')

}