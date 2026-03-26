import { FullCompany } from "@/features/company/utils/types";
import { vatRates } from "@/features/items/lib/contants";
import { VatKey, VatRate } from "@/features/items/utils/types";
import { generateMonogram } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import { DocType, InvoiceType } from "../../lib/types/document";

export const PDFBlob = async ({ document }: any) => {
  return await pdf(document).toBlob();
}

export const getDocName = (company: FullCompany, docType: DocType) => {
  return `${company.monogram ? company.monogram : generateMonogram(company.name)}-${docType}-${new Date().getFullYear()}-`
}

export const getVatRate = (vatKey: VatKey) => vatRates.find((vatRate) => vatRate.value === vatKey) as VatRate

export const getInvoiceType = (type: InvoiceType) => {
  switch (type) {
    case "CREATE":
      return "Számla"
    case "MODIFY":
      return "Helyesbítő számla"
    case "STORNO":
      return "Sztornó számla"
    default:
      return "Ismeretlen"
  }
}
