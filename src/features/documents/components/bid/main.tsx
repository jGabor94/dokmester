'use client'

import { Button, buttonVariants } from "@/components/ui/btn"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FullCompany } from "@/features/company/utils/types"
import NewBidForm from "@/features/documents/components/bid/form"
import DownloadDocument from "@/features/documents/components/DownloadDocument"
import PDFViewerContainer from "@/features/documents/components/pdf/PDFViewer"
import { Bid } from "@/features/documents/components/pdf/schema/Bid"
import PrintDocument from "@/features/documents/components/PrintDocument"
import SendDocument from "@/features/documents/components/SendDocument"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircleIcon, CircleCheckBigIcon, FileSearchIcon } from "lucide-react"
import { FC, useState } from "react"
import { SubmitHandler, useForm, useWatch } from "react-hook-form"
import toast from "react-hot-toast"
import { SA_GenDocName, SA_SaveDocument } from "../../actions"
import { BidInputs, SelectDocument } from "../../lib/types/document"
import { bidFormSchema } from "../../lib/zod"
import { getDocName, PDFBlob } from "../../utils/client"


const Main: FC<{ company: FullCompany, issuerEmail: string }> = ({ company, issuerEmail }) => {

  const [savedDoc, setSavedDoc] = useState<SelectDocument | null>(null)

  const form = useForm<BidInputs>({
    mode: "all",
    defaultValues: {
      type: "BID",
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
      exchangeRate: 1,
      items: []
    },
    resolver: zodResolver(bidFormSchema),
  })

  const bidForm = useWatch({ control: form.control }) as Required<BidInputs>;


  const handleSave: SubmitHandler<BidInputs> = async (data) => {

    const res1 = await SA_GenDocName('BID')

    if (res1.statusCode === 200) {

      const pdf = await PDFBlob({ document: <Bid data={data} name={res1.payload.docName} color={company.color ?? "#13a4ec"} logo={company.logo} /> });

      const res2 = await SA_SaveDocument(data, pdf)

      if (res2.statusCode === 200) {
        setSavedDoc(res2.payload.createdDoc)
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

  const handleReset = () => {
    form.reset()
    setSavedDoc(null)
  }

  return (
    <section>
      <header className={`mb-4 text-center md:text-start`}>
        <h1 className={`font-bold text-4xl`}>Árajánlat kiállítása</h1>
      </header>
      <div className={``}>
        {!savedDoc ? (
          <>
            <div className={`mb-4 flex gap-4`}>
              <Button className={`flex items-center gap-2 `} loading={form.formState.isSubmitting} onClick={form.handleSubmit(handleSave)} disabled={!form.formState.isValid || form.formState.isSubmitting}>
                <CircleCheckBigIcon strokeWidth={1.5} />
                <span>Árajánlat kiállítása</span>
              </Button>
              <Dialog>
                <DialogTrigger className={`${buttonVariants({ variant: 'outline' })}`}>
                  <FileSearchIcon />
                  <span>Előnézet</span>
                </DialogTrigger>
                <DialogContent className={`max-h-[90dvh] max-w-[90dvw] md:max-w-[640px] h-full w-full rounded-2xl sm:rounded-2xl p-3`}>
                  <DialogHeader className={`space-y-0`}>
                    <DialogTitle className={`mb-4 text-lg`}>Árajánlat előnézete</DialogTitle>
                    <PDFViewerContainer document={<Bid data={bidForm} name={getDocName(company, 'BID')} color={company.color ?? "#13a4ec"} logo={company.logo} />} className={`h-full w-full`} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <NewBidForm company={company} form={form} partners={company.partners} />
          </>
        ) : (
          <>
            <div className={`grid gap-4 border shadow-sm p-3 bg-card rounded-2xl max-w-lg w-full mx-auto`}>
              <CheckCircleIcon className={`mx-auto text-emerald-500 size-16`} strokeWidth={1.5} />
              <h1 className={`font-bold text-2xl text-center`}>Árajánlat elkészült</h1>
              <p className={`text-muted-foreground text-sm md:text-base text-center`}>Az elkészült dokumentum megtalálható a dokumentumok oldalon</p>
              <div className={`flex flex-wrap justify-center items-center gap-x-4 gap-y-3`}>
                <PrintDocument document={savedDoc} />
                <DownloadDocument document={savedDoc} />
                <SendDocument document={savedDoc} />
              </div>
              <div className={`border-t`}></div>
              <div className={`flex flex-wrap justify-center items-center gap-x-4 gap-y-3`}>
                <Button className={`flex items-center`} onClick={handleReset} >Új árajánlat</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Main