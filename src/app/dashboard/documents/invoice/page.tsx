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
import DownloadDocument from "@/features/documents/components/DownloadDocument"
import PrintDocument from "@/features/documents/components/PrintDocument"
import { getInvoiceType } from "@/features/documents/utils/client"
import CreateStorno from "@/features/invoice/components/CreateStorno"
import DeleteInvoice from "@/features/invoice/components/DeleteInvoice"
import SendInvoice from "@/features/invoice/components/SendInvoice"
import UpdateInvoice from "@/features/invoice/components/UpdateInvoice"
import { invoiceStatus, InvoiceStatusEnum } from "@/features/invoice/lib/constants"
import { getInvoices } from "@/features/invoice/queries"
import NavInfo from "@/features/navApi/components/Info"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import Form from "next/form"
import Link from "next/link"
import { redirect } from "next/navigation"

const DocumentsPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const session = await auth()

  if (!session || !session.user.companyID) return redirect("/")

  const company = await getFullCompany(session.user.companyID as string)

  const invoices = await getInvoices(session.user.companyID, (await searchParams));

  return (
    <>
      <section>
        <header className={`flex justify-between items-center mb-6`}>
          <div>
            <h1 className={`font-bold text-4xl`}>Számlák</h1>
            <small className={`font-bold`}>Összesen: {invoices.length}db</small>
          </div>
          <Link className={`hidden lg:block`} href={`/dashboard/documents/invoice/create`}>
            <Button >
              <Plus />
              Új számla
            </Button>
          </Link>
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
              <Label htmlFor="state">Státusz</Label>
              <Select name="state" defaultValue={(await searchParams).state as string}>
                <SelectTrigger>
                  <SelectValue placeholder="Összes státusz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'ALL'}>Összes státusz</SelectItem>
                    {InvoiceStatusEnum.map(status => (
                      <SelectItem key={status} value={status}>{invoiceStatus[status]}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant={"outline"} className={`col-start-1 lg:col-start-6 col-end-3 lg:col-end-7`}>Szűrés</Button>
          </div>
        </Form>
        <Accordion type="single" collapsible className={`w-full grid grid-cols-1 gap-3`}>
          {invoices.map((invoice) => (
            <AccordionItem value={`doc_${invoice.id}`} className={`border shadow-sm rounded-2xl px-3 bg-card`} key={invoice.id}>
              <AccordionTrigger className={`hover:no-underline py-3 `}>
                <div className={`flex flex-row justify-between gap-3 w-full items-center px-4`}>
                  <p className={`font-bold`}>{invoice.name}</p>
                  {invoice.type === "CREATE" && <p >{getInvoiceType(invoice.type)}</p>}
                  {invoice.type === "MODIFY" && <p className="text-amber-600">{getInvoiceType(invoice.type)}</p>}
                  {invoice.type === "STORNO" && <p className="text-red-500">{getInvoiceType(invoice.type)}</p>}
                  <p className={`hidden lg:block`}>{invoice.createdAt.toLocaleDateString('hu-HU')}</p>
                  <div className="flex flex-row gap-2">
                    <Tag color={invoice.status}>{invoiceStatus[invoice.status]}</Tag>
                    {invoice.navErrors && <NavInfo navErrors={invoice.navErrors} />}
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

                    {["pending", "sended"].includes(invoice.status) && (
                      <div>
                        <span className={`text-xs text-foreground/60 block mb-1`}>Státusz</span>
                        <UpdateInvoice status={invoice.status} invoiceID={invoice.id} />
                      </div>
                    )}

                    <div>
                      <span className={`text-xs text-foreground/60 block mb-1`}>Történet</span>
                      {invoice.history.map((history, index) => (
                        <div key={index} className="flex flex-row gap-2 items-center">
                          <span key={index} className={`text-sm `}>{history.serial}. {history.name}</span>
                          <span className={cn("font-bold", history.type === "STORNO" && "text-red-500", history.type === "MODIFY" && "text-amber-600", history.type === "CREATE" && "text-lime-500")}>{getInvoiceType(history.type)}</span>
                        </div>

                      ))}
                    </div>


                  </div>

                  {!invoice.originalInvoice && !invoice.history.some((inv) => inv.type === "STORNO") && (
                    <CreateStorno invoice={invoice} company={company as FullCompany} />
                  )}

                </div>


                <div className={`pt-3 border-t`}>
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div className={`flex flex-wrap gap-4`}>
                      <DownloadDocument document={invoice} />
                      {["pending", "expired"].includes(invoice.status) && hasPermission(session.user, "INV", "send") && <SendInvoice invoice={invoice} />}
                      <PrintDocument document={invoice} />
                    </div>
                    {["pending", "aborted"].includes(invoice.status) && hasPermission(session.user, "INV", "delete") && <DeleteInvoice invoiceID={invoice.id} />}
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