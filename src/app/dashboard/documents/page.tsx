import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/btn"
import { Input } from "@/components/ui/inpt"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Tag from "@/components/ui/Tag"
import { auth } from "@/features/authentication/lib/auth"
import { hasPermission } from "@/features/authorization/utils"
import { getFullCompany } from "@/features/company/queries/getCompany"
import { FullCompany } from "@/features/company/utils/types"
import DeleteDocument from "@/features/documents/components/DeleteDocument"
import DownloadDocument from "@/features/documents/components/DownloadDocument"
import CreateStorno from "@/features/documents/components/invoice/CreateStorno"
import PrintDocument from "@/features/documents/components/PrintDocument"
import SendDocument from "@/features/documents/components/SendDocument"
import UpdateDocument from "@/features/documents/components/UpdateDocument"
import { DocStatus } from "@/features/documents/lib/types/document"
import { getDocuments } from "@/features/documents/queries"
import { getInvoiceType } from "@/features/documents/utils/client"
import { docNameMap, docStatusMap } from "@/features/documents/utils/docTanslations"
import NavInfo from "@/features/navApi/components/Info"
import queryTransactionStatus from "@/features/navApi/lib/api/queryTransactionStatus"
import { db } from "@/lib/drizzle/db"
import { documentsTable, navDataTable } from "@/lib/drizzle/schema"
import { cn } from "@/lib/utils"
import { eq, sql } from "drizzle-orm"
import Form from "next/form"
import { redirect } from "next/navigation"

const DocumentsPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const session = await auth()

  if (!session || !session.user.companyID) return redirect("/")

  const company = await getFullCompany(session.user.companyID as string)

  let documents = await getDocuments(session.user.companyID, (await searchParams));

  const navData = await db.query.navDataTable.findFirst({ where: eq(navDataTable.companyID, session.user.companyID) })

  if (navData) {
    const promises = documents.map(doc => (async () => {

      if (doc.state === "validation" || doc.state === "aborted") {
        const res = await queryTransactionStatus({ authData: navData, taxNumber: doc.data.supplier.taxnumber, transactionId: doc.transactionID as string, returnOriginalRequest: true })
        const result = res.objResponse.QueryTransactionStatusResponse.processingResults[0].processingResult[0]
        if (result.invoiceStatus[0] === "ABORTED") {
          console.log(result)
          let errors: string[] = []
          if (result.technicalValidationMessages && result.technicalValidationMessages.length > 0) {
            errors = [...result.technicalValidationMessages.map((error: any) => error.message[0])]
          }

          if (result.businessValidationMessages && result.businessValidationMessages.length > 0) {
            errors = [...errors, ...result.businessValidationMessages.map((error: any) => error.message[0])]
          }
          const nav = {
            errors,
            xml: result.originalRequest[0],
          }
          await db.update(documentsTable).set({
            state: "aborted",
            data: sql`jsonb_set(data::jsonb, ${sql.param(`{nav}`)}, ${sql.param(JSON.stringify(nav))})::json`
          }).where(eq(documentsTable.id, doc.id))
          return { ...doc, state: "aborted" as DocStatus, data: { ...doc.data, nav } }
        } else if (result.invoiceStatus[0] === "PROCESSING") {
          return doc
        } else {
          await db.update(documentsTable).set({ state: "pending" }).where(eq(documentsTable.id, doc.id))
          return { ...doc, state: "pending" as DocStatus }

        }
      } else {
        return doc
      }
    })())

    documents = await Promise.all(promises)
  }

  return (
    <>
      <section>
        <header className={`flex justify-between items-center mb-6`}>
          <div>
            <h1 className={`font-bold text-4xl`}>Dokumentumok</h1>
            <small className={`font-bold`}>Összesen: {documents.length}db</small>
          </div>
        </header>
        <Form action="" className={`flex justify-between items-center gap-4 mb-8 bg-card p-3 pt-2 rounded-2xl shadow-sm border`}>
          <div className={`grid grid-cols-2 lg:grid-cols-6 justify-start items-end gap-4`}>
            <div>
              <Label htmlFor="search">Keresés</Label>
              <Input name="search" id="search" placeholder="Cégnév, adószám, azonosító" defaultValue={(await searchParams).search} />
            </div>
            <div>
              <Label htmlFor="startdate">Kezdő dátum</Label>
              <Input type={`date`} name="startdate" id="startdate" defaultValue={(await searchParams).startdate} />
            </div>
            <div>
              <Label htmlFor="enddate">Utolsó dátum</Label>
              <Input type={`date`} name="enddate" id="enddate" defaultValue={(await searchParams).enddate} />
            </div>
            <div>
              <Label htmlFor="enddate">Típus</Label>
              <Select name="type" defaultValue={(await searchParams).type as string}>
                <SelectTrigger>
                  <SelectValue placeholder="Összes típus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'ALL'}>Összes típus</SelectItem>
                    {Object.entries(docNameMap).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="state">Státusz</Label>
              <Select name="state" defaultValue={(await searchParams).state as string}>
                <SelectTrigger>
                  <SelectValue placeholder="Összes státusz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'ALL'}>Összes státusz</SelectItem>
                    {Object.entries(docStatusMap).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className={`col-start-1 lg:col-start-6 col-end-3 lg:col-end-7`}>Szűrés</Button>
          </div>
        </Form>
        <Accordion type="single" collapsible className={`w-full grid grid-cols-1 gap-3`}>
          {documents.map((doc) => (
            <AccordionItem value={`doc_${doc.id}`} className={`border shadow-sm rounded-2xl px-3 bg-card`} key={doc.id}>
              <AccordionTrigger className={`hover:no-underline py-3`}>
                <div className={`grid grid-cols-3 lg:grid-cols-4 gap-3 w-full items-center`}>
                  <p className={`font-bold`}>{doc.name}</p>
                  {doc.data.type === "INV" && doc.data.invoiceType === "CREATE" && <p >{getInvoiceType(doc.data.invoiceType)}</p>}
                  {doc.data.type === "INV" && doc.data.invoiceType === "MODIFY" && <p className="text-amber-600">{getInvoiceType(doc.data.invoiceType)}</p>}
                  {doc.data.type === "INV" && doc.data.invoiceType === "STORNO" && <p className="text-red-500">{getInvoiceType(doc.data.invoiceType)}</p>}
                  {doc.data.type !== "INV" && <p >{docNameMap[doc.data.type]}</p>}

                  <p className={`hidden lg:block`}>{doc.createdAt.toLocaleDateString('hu-HU')}</p>
                  <div className="flex flex-row gap-2">
                    <Tag color={doc.state}>{docStatusMap[doc.state]}</Tag>
                    {doc.data.type === "INV" && doc.data?.nav && <NavInfo nav={doc.data.nav} />}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className={`pb-3`}>
                {/*
                  <div className={`flex items-start justify-between flex-wrap gap-4 py-3 border-t`}>
                  <div>
                    <span className={`text-xs text-foreground/60 block mb-1`}>Megrendelő</span>
                    <p>{doc.data.customer.name}</p>
                  </div>
                  {doc.data.customer.mobile && (
                    <div>
                      <span className={`text-xs text-foreground/60 block mb-1`}>Adószáma</span>
                      <p>{doc.data.customer.taxnumber}</p>
                    </div>
                  )}
                  <div>
                    <span className={`text-xs text-foreground/60 block mb-1`}>Címe</span>
                    <p>{doc.data.customer.zip} {doc.data.customer.city}, {doc.data.customer.address}</p>
                  </div>
                  <div>
                    <span className={`text-xs text-foreground/60 block mb-1`}>E-mail címe</span>
                    <p>{doc.data.customer.email}</p>
                  </div>
                  {doc.data.customer.mobile && (
                    <div>
                      <span className={`text-xs text-foreground/60 block mb-1`}>Telefonszáma</span>
                      <p>{doc.data.customer.mobile}</p>
                    </div>
                  )}
                </div>
                <div className={`flex items-start justify-between flex-wrap gap-4 py-3 border-t`}>
                  <div>
                    <span className={`text-xs text-foreground/60 block mb-1`}>Végösszeg</span>
                    <p>{doc.data.items.reduce((acc, curr) => acc + Number(Math.round(curr.unitPrice * (1 + vatRatesMap[curr.vatkey].vatValue) * curr.quantity)), 0).toLocaleString('hu-HU')} Ft</p>
                  </div>
                  {["pending", "sended", "accepted"].includes(doc.state) && (
                    <div>
                      <span className={`text-xs text-foreground/60 block mb-1`}>Státusz</span>
                      <UpdateDocument status={doc.state} docID={doc.id} />
                    </div>
                  )}
                  <div>
                    <span className={`text-xs text-foreground/60 block mb-1`}>Kiállítás dátuma</span>
                    <p>{doc.createdAt.toLocaleDateString('hu-HU')}</p>
                  </div>
                  <div>
                    <span className={`text-xs text-foreground/60 block mb-1`}>Kiállító</span>
                    <p>{session?.user?.name}</p>
                  </div>
                </div>
                <div className={`pt-3 border-t`}>
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div className={`flex flex-wrap gap-4`}>
                      <DownloadDocument document={doc} />
                      {doc.state === "pending" && hasPermission(session.user, doc.data.type, "send") && <SendDocument document={doc} />}
                      <PrintDocument document={doc} />
                    </div>
                    {["pending", "aborted"].includes(doc.state) && hasPermission(session.user, doc.data.type, "delete") && <DeleteDocument docID={doc.id} />}
                  </div>
                </div>
                
                */}
                <div className="flex flex-row gap-8">
                  <div className={`flex flex-col items-start justify-between flex-wrap gap-4 py-3 border-t`}>

                    {["pending", "sended", "accepted"].includes(doc.state) && (
                      <div>
                        <span className={`text-xs text-foreground/60 block mb-1`}>Státusz</span>
                        <UpdateDocument status={doc.state} docID={doc.id} />
                      </div>
                    )}
                    {doc.data.type === "INV" && (
                      <div>
                        <span className={`text-xs text-foreground/60 block mb-1`}>Történet</span>
                        {doc.data.history.map((history, index) => (
                          <div key={index} className="flex flex-row gap-2 items-center">
                            <span key={index} className={`text-sm `}>{history.serial}. {history.name}</span>
                            <span className={cn("font-bold", history.type === "STORNO" && "text-red-500", history.type === "MODIFY" && "text-amber-600", history.type === "CREATE" && "text-lime-500")}>{getInvoiceType(history.type)}</span>
                          </div>

                        ))}
                      </div>

                    )}

                  </div>

                  {doc.data.type === "INV" && !doc.data.originalInvoice && !doc.data.history.some((inv) => inv.type === "STORNO") && (
                    <CreateStorno data={doc.data} name={doc.name} originalInvoiceID={doc.id} company={company as FullCompany} />
                  )}

                </div>


                <div className={`pt-3 border-t`}>
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div className={`flex flex-wrap gap-4`}>
                      <DownloadDocument document={doc} />
                      {doc.state === "pending" && hasPermission(session.user, doc.data.type, "send") && <SendDocument document={doc} />}
                      <PrintDocument document={doc} />
                    </div>
                    {["pending", "aborted"].includes(doc.state) && hasPermission(session.user, doc.data.type, "delete") && <DeleteDocument docID={doc.id} />}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  )
}

export default DocumentsPage