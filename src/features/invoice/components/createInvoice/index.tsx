'use client'

import { Button, buttonVariants } from "@/components/ui/btn"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FullCompany } from "@/features/company/utils/types"
import { SA_GenDocName } from "@/features/documents/actions"
import DownloadDocument from "@/features/documents/components/DownloadDocument"
import PDFViewerContainer from "@/features/documents/components/pdf/PDFViewer"
import { Invoice } from "@/features/documents/components/pdf/schema/Invoice"
import PrintDocument from "@/features/documents/components/PrintDocument"
import SendDocument from "@/features/documents/components/SendDocument"
import { getDocName, PDFBlob } from "@/features/documents/utils/client"
import { getDate } from "@/features/navApi/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircleIcon, CircleCheckBigIcon, FileSearchIcon } from "lucide-react"
import { FC, useState } from "react"
import { FieldErrors, SubmitErrorHandler, SubmitHandler, useForm, useWatch } from "react-hook-form"
import toast from "react-hot-toast"
import { SA_SaveInvoice } from "../../actions"
import { InvoiceInputs, SelectInvoice } from "../../lib/types"
import { invoiceFormSchema } from "../../lib/zod"
import InvoiceForm from "./InvoiceForm"

const CreateInvoice: FC<{ company: FullCompany, issuerEmail: string }> = ({ company, issuerEmail }) => {

  const [savedInvoice, setSavedInvoice] = useState<SelectInvoice | null>(null)

  const form = useForm<InvoiceInputs>({
    mode: "onSubmit",
    defaultValues: {
      supplier: {
        name: company.name,
        countryCode: company.countryCode,
        zip: company.zip,
        city: company.city,
        address: company.address,
        taxnumber: company.taxnumber,
        groupMemberTaxNumber: company.groupMemberTaxNumber,
        communityVatNumber: company.communityVatNumber,
        bankAccountNumber: company.bankAccountNumber,
        email: issuerEmail
      },
      currency: "HUF",
      paymentMethod: "TRANSFER",
      completionDate: getDate(),
      dueDate: getDate(),
      exchangeRate: 1,
      items: []
    },
    resolver: zodResolver(invoiceFormSchema),
  })


  const handleSave: SubmitHandler<InvoiceInputs> = async (data) => {


    const res1 = await SA_GenDocName('INV')
    if (res1.statusCode === 200) {

      const pdf = await PDFBlob({ document: <Invoice data={invoiceForm} name={res1.payload.docName} color={company.color ?? "#13a4ec"} logo={company.logo} /> })

      const res2 = await SA_SaveInvoice(data, pdf)

      if (res2.statusCode === 200) {
        setSavedInvoice(res2.payload.createdDoc)
      } else if (res2.statusCode !== 500) {
        toast.error(res2.error);
      } else {
        toast.error(res2.statusMessage);
      }
    } else if (res1.statusCode !== 500) {
      toast.error(res1.error);
    } else {
      toast.error(res1.statusMessage);
    }

  }

  const invoiceForm = useWatch({ control: form.control }) as InvoiceInputs;

  const onError: SubmitErrorHandler<InvoiceInputs> = async (data) => {
    console.log(data)
    const renderErrors = (errors: FieldErrors<InvoiceInputs>) => {
      const renderList = (obj: any): JSX.Element => {
        return (
          <ul className="list-disc ml-4">
            {Object.entries(obj).map(([key, value]: any) => (
              <li key={key}>
                {value?.message || key}
                {value && typeof value === "object" && !value.message && renderList(value)}
              </li>
            ))}
          </ul>
        );
      };

      return renderList(errors);
    };

    toast.error(renderErrors(data), { duration: 6000 });
  }

  const handleReset = () => {
    form.reset()
    setSavedInvoice(null)
  }

  return (
    <section>
      <header className={`mb-4 text-center md:text-start`}>
        <h1 className={`font-bold text-4xl`}>Számla kiállítása</h1>
        {/*
              <div className="flex flex-col border border-1 rounded-lg bg-card shadow-sm">
          <span className='py-2 px-4 font-semibold'>NAV API teszt</span>
          <div className='h-[1px] bg-gray-200' />
          <div className='p-4'>
            <TestNavAPI />
          </div>
        </div>
        */}

      </header>
      <div className={``}>
        {!savedInvoice ? (
          <>
            <div className={`mb-4 flex gap-4`}>
              <Button className={`flex items-center gap-2 `} loading={form.formState.isSubmitting} onClick={form.handleSubmit(handleSave, onError)} disabled={form.formState.isSubmitting}>
                <CircleCheckBigIcon strokeWidth={1.5} />
                <span>Számla kiállítása</span>
              </Button>
              <Dialog>
                <DialogTrigger className={`${buttonVariants({ variant: 'outline' })}`}>
                  <FileSearchIcon />
                  <span>Előnézet</span>
                </DialogTrigger>
                <DialogContent className={`max-h-[90dvh] max-w-[90dvw] md:max-w-[640px] h-full w-full rounded-2xl sm:rounded-2xl p-3`}>
                  <DialogHeader className={`space-y-0`}>
                    <DialogTitle className={`mb-4 text-lg`}>Számla előnézete</DialogTitle>
                    <PDFViewerContainer document={<Invoice data={invoiceForm} name={getDocName(company, 'INV')} color={company.color ?? "#13a4ec"} logo={company.logo} />} className={`h-full w-full`} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <InvoiceForm company={company} form={form} partners={company.partners} />
          </>
        ) : (
          <>
            <div className={`grid gap-4 border shadow-sm p-3 bg-card rounded-2xl max-w-lg w-full mx-auto`}>
              <CheckCircleIcon className={`mx-auto text-emerald-500 size-16`} strokeWidth={1.5} />
              <h1 className={`font-bold text-2xl text-center`}>Számla elkészült</h1>
              <p className={`text-muted-foreground text-sm md:text-base text-center`}>Az elkészült dokumentum megtalálható a dokumentumok oldalon</p>
              <div className={`flex flex-wrap justify-center items-center gap-x-4 gap-y-3`}>
                <PrintDocument document={savedInvoice} />
                <DownloadDocument document={savedInvoice} />
                <SendDocument document={savedInvoice} />
              </div>
              <div className={`border-t`}></div>
              <div className={`flex flex-wrap justify-center items-center gap-x-4 gap-y-3`}>
                <Button className={`flex items-center`} onClick={handleReset} >Új számla</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default CreateInvoice