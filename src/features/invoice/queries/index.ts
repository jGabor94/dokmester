import queryTransactionStatus from "@/features/navApi/lib/api/queryTransactionStatus"
import { db } from "@/lib/drizzle/db"
import { invoicesTable, navDataTable } from "@/lib/drizzle/schema"
import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm"
import { InvoiceStatus } from "../lib/types"

export const getInvoices = async (companyID: string, searchParams: any) => {
  let invoices = await db.query.invoicesTable.findMany({
    where: and(
      eq(invoicesTable.companyID, companyID),
      (searchParams?.type && searchParams?.type != 'ALL' ? eq(
        invoicesTable.type, searchParams.type
      ) : undefined),
      (searchParams?.state && searchParams?.state != 'ALL' ? eq(
        invoicesTable.status, searchParams.state
      ) : undefined),
      (searchParams?.search && searchParams?.search != '' ? or(
        sql`${invoicesTable.data}#>>'{applicant,name}' LIKE ${`%${searchParams?.search}%`}`,
        sql`${invoicesTable.data}#>>'{applicant,taxnumber}' LIKE ${`%${searchParams?.search}%`}`,
        like(invoicesTable.name, `%${searchParams?.search}%`),
      ) : undefined),
      (searchParams?.startdate && searchParams?.startdate != '' ? gte(
        invoicesTable.createdAt, new Date(searchParams.startdate)
      ) : undefined),
      (searchParams?.enddate && searchParams?.enddate != '' ? lte(
        invoicesTable.createdAt, new Date(searchParams.enddate)
      ) : undefined),
    ),
    orderBy: [desc(invoicesTable.createdAt)]
  })

  const navData = await db.query.navDataTable.findFirst({ where: eq(navDataTable.companyID, companyID) })

  if (navData) {
    const promises = invoices.map(invoice => (async () => {

      if (invoice.status === "validation" || invoice.status === "aborted") {
        const res = await queryTransactionStatus({ authData: navData, taxNumber: invoice.data.supplier.taxnumber, transactionId: invoice.transactionID as string, returnOriginalRequest: true })
        const result = res.objResponse.QueryTransactionStatusResponse.processingResults[0].processingResult[0]
        if (result.invoiceStatus[0] === "ABORTED") {
          let errors: string[] = []
          if (result.technicalValidationMessages && result.technicalValidationMessages.length > 0) {
            errors = [...result.technicalValidationMessages.map((error: any) => error.message[0])]
          }

          if (result.businessValidationMessages && result.businessValidationMessages.length > 0) {
            errors = [...errors, ...result.businessValidationMessages.map((error: any) => error.message[0])]
          }
          const navErrors = {
            errors,
            xml: result.originalRequest[0],
          }
          await db.update(invoicesTable).set({
            status: "aborted",
            navErrors
          }).where(eq(invoicesTable.id, invoice.id))
          return { ...invoice, status: "aborted" as InvoiceStatus, navErrors }
        } else if (result.invoiceStatus[0] === "PROCESSING") {
          return invoice
        } else {
          await db.update(invoicesTable).set({ status: "pending" }).where(eq(invoicesTable.id, invoice.id))
          return { ...invoice, status: "pending" as InvoiceStatus }

        }
      } else {
        return invoice
      }
    })())

    return Promise.all(promises)
  }

  return invoices
}

export const getInvoice = async (id: string) => {
  return db.query.invoicesTable.findFirst({
    where: eq(invoicesTable.id, id)
  })
}


/*
export const genSzamlazzHuXML = ({ customer, config, header, seller, items, deliveryNote }: SzamlazzXmlData) => `<?xml version="1.0" encoding="UTF-8"?>
            <xmlszamla xmlns="http://www.szamlazz.hu/xmlszamla" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.szamlazz.hu/xmlszamla https://www.szamlazz.hu/szamla/docs/xsds/agent/xmlszamla.xsd">
            <!-- A számla alapbeállításai -->
                <beallitasok>
                    <!-- Számla Agent kulcsot a számlázz.hu-ra belépve tudsz generálni -->
                    <szamlaagentkulcs>${process.env.SZAMLAZZ_API_KEY}</szamlaagentkulcs>
                    <eszamla>${config?.eInvoice || "false"}</eszamla>
                    <!-- „true” ha e-számlát kell létrehozni -->
                    <szamlaLetoltes>${config?.invoiceDownload || "false"}</szamlaLetoltes>
                    <!-- „true” ha szeretnéd a választ PDF számlaként megkapni -->
                    <valaszVerzio>${config?.responseVersion || 1}</valaszVerzio>
                    <!-- 1: egyszerű szöveges vagy PDF válasz.
                        2: XML válasz, ha a PDF-et is kéred, az XML-ben kerül elküldésre base64 kódolással -->
                    <aggregator>${config?.aggregator || ""}</aggregator>
                    <!-- ez a tag kihagyható -->
                    <szamlaKulsoAzon>${config.id}</szamlaKulsoAzon> <!--A számla ezzel a kulccsal azonosítható a harmadik fél rendszerében (a rendszer, amely használja a Számla Agentet): később ezzel a kulccsal le lehet kérdezni a számlát -->
                </beallitasok>
                <!-- fejléc adatok -->
                <fejlec>
                    <teljesitesDatum>2026-03-24</teljesitesDatum>
                    <!-- teljesítés dátuma -->
                    <fizetesiHataridoDatum>2026-03-24</fizetesiHataridoDatum>
                    <!-- fizetési határidő -->
                    <fizmod>${header.paymentMethod || "Bankkártyás"}</fizmod>
                    <!-- fizetési mód: látható, ha a számlát böngészőből készíted -->
                    <penznem>${header.currency || "HUF"}</penznem>
                    <!-- pénznem: látható, ha a számlát böngészőből készíted -->
                    <szamlaNyelve>${header.lang || "hu"}</szamlaNyelve>
                    <!-- számla nyelve, lehet: de, en, it, hu, fr, ro, sk, hr -->
                    <megjegyzes>${header.invoiceComment || ""}</megjegyzes>
                    <!-- számla megjegyzése -->
                    <arfolyamBank>${header.exchangeRateBank || "MNB"}</arfolyamBank>
                    <!-- bank neve: ha a számla nem HUF-ban van, fel kell tüntetni, melyik bank árfolyamát használtuk az ÁFA kiszámításához -->
                    <arfolyam>${header.exchangeRate || "0.0"}</arfolyam>
                    <!-- árfolyam: ha a számla nem HUF-ban van, fel kell tüntetni, melyik bank árfolyamát használtuk az ÁFA kiszámításához -->
                    <rendelesSzam>${config.id}</rendelesSzam>
                    <!-- rendelési szám -->
                    <dijbekeroSzamlaszam>${header.freeRequestAccountNumber || ""}</dijbekeroSzamlaszam>
                    <!-- hivatkozás a díjbekérő számlaszámra -->
                    <elolegszamla>${header.advanceInvoice || "false"}</elolegszamla>
                    <!-- előlegszámla -->
                    <vegszamla>${header.finalInvoice || "false"}</vegszamla>
                    <!-- végszámla (előlegszámla után) -->
                    <helyesbitoszamla>${header.correctionInvoice || "false"}</helyesbitoszamla>
                    <!-- helyesbítő számla -->
                    <helyesbitettSzamlaszam>${header.correctionInvoiceNumber || ""}</helyesbitettSzamlaszam>
                    <!-- a helyesbített számla száma -->
                    <dijbekero>${header.freeRequest || "false"}</dijbekero>
                    <!-- díjbekérő számla -->
                    <szamlaszamElotag>${header.accountNumberPrefix || "J"}</szamlaszamElotag>
                    <!-- A számlázz.hu-ban használható Előtagok egyike - Beállítások / Előtagok -->
                </fejlec>
                <elado>
                    <!-- A kereskedő adatai -->
                    <bank>${seller?.bank || "BB"}</bank>
                    <!-- bank neve -->
                    <bankszamlaszam>${seller?.bankAccountNumber || "11111111-22222222-33333333"}</bankszamlaszam>
                    <!-- bankszámlaszám -->
                    <emailReplyto>${seller?.emailReplyto || ""}</emailReplyto>
                    <!-- válaszcím (e-mail) -->
                    <emailTargy>${seller?.emailSubject || "Invoice notification"}</emailTargy>
                    <!-- e-mail tárgya -->
                    <emailSzoveg>${seller?.emailText || "mail text"}</emailSzoveg>
                    <!-- e-mail szövege -->
                </elado>
                <vevo>
                    <!-- Vevő adatai -->
                    <nev>${customer.name}</nev>
                    <!-- név -->
                    <irsz>${customer.zip}</irsz>
                    <!-- irányítószám -->
                    <telepules>${customer.city}</telepules>
                    <!-- város -->
                    <cim>${customer.address}</cim>
                    <!-- cím -->
                    <email>${customer.email || ""}</email>
                    <!-- e-mail cím, ha megadja, erre a címre elküldjük a számlát -->
                    <sendEmail>${customer?.sendEmail || "false"}</sendEmail>
                    <!-- küldjük-e el e-mailben az ügyfélnek (e-mail) -->
                    <adoszam>${customer.taxnumber || '59611154-1-27'}</adoszam>
                    <!-- adószám/adóazonosító jel -->
                    <postazasiNev>${customer.postalName || ""}</postazasiNev>
                    <!-- szállítási név/postai név -->
                    <postazasiIrsz>${customer.postalZip || ""}</postazasiIrsz>
                    <!-- szállítási irányítószám/postai irányítószám -->
                    <postazasiTelepules>${customer.postalCity || ""}</postazasiTelepules>
                    <!-- szállítási város/postai város -->
                    <postazasiCim>${customer.postalAddress || ""}</postazasiCim>
                    <!-- szállítási cím/postai cím -->
                    <azonosito>${customer.id || "1234"}</azonosito>
                    <!-- azonosító -->
                    <telefonszam>Tel: ${customer.phoneNumber || ""}</telefonszam>
                    <!-- telefonszám -->
                    <megjegyzes> ${customer.comment || "Call extension 214 from the reception"}</megjegyzes>
                    <!-- megjegyzés -->
                </vevo>
                <fuvarlevel>
                    <!-- fuvarlevél/szállítólevél. ha nem kell, hagyd üresen -->
                    <uticel>${deliveryNote?.destination || ""}</uticel>
                    <futarSzolgalat>${deliveryNote?.courierService || ""}</futarSzolgalat>
                </fuvarlevel>
                <tetelek>
                  ${items.map((item) => {
  return `
                      <tetel>
                        <!-- 1. tétel -->
                        <megnevezes>${item.name}</megnevezes>
                        <!-- megnevezés -->
                        <mennyiseg>${item.quantity}</mennyiseg>
                        <!-- mennyiség -->
                        <mennyisegiEgyseg>${item.unit}</mennyisegiEgyseg>
                        <!-- mennyiségi egység -->
                        <nettoEgysegar>${item.unitPrice}</nettoEgysegar>
                        <!-- nettó egységár -->
                        <afakulcs>${item.vatkey}</afakulcs>
                        <!-- ÁFA kulcs -->
                        <nettoErtek>${item.unitPrice * item.quantity}</nettoErtek>
                        <!-- nettó érték -->
                        <afaErtek>${item.vatAmount || ((item.unitPrice * item.quantity) * (1 + (item.vatkey / 100))) - item.unitPrice * item.quantity}</afaErtek>
                        <!-- ÁFA érték -->
                        <bruttoErtek>${item.grossAmount || (item.unitPrice * item.quantity) * (1 + (item.vatkey / 100))}</bruttoErtek>
                        <!-- bruttó érték -->
                        <megjegyzes>${item.comment || ""}</megjegyzes>
                        <!-- tétel megjegyzése -->
                    </tetel>`
})}
                </tetelek>
                </xmlszamla>
                `
 
  */
/*let parser = new DOMParser();
let xmlDoc = parser.parseFromString(output,"text/xml");*/

