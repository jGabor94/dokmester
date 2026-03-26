import { SelectInvoice } from "@/features/invoice/lib/types";
import { Container, Heading, Hr, Img, Link, Section, Tailwind, Text } from "@react-email/components";
import { tailwindEmailConfig } from "../utils/tailwind";

const NewInvoiceMail = (invoice: SelectInvoice, customHtml?: string) => (

  <Tailwind config={tailwindEmailConfig} >
    <Container className={`bg-slate-50 text-slate-950 my-0 mx-auto`}>
      <Section className={`bg-curious-blue-500 mb-0`}>
        <Img src={`https://dokmester.com/Banner_Web_White.png`} width="231" height="32" alt="DokMester Banner" className={`mx-auto my-4`} />
      </Section>
      <Section className={`bg-slate-50 p-6`}>
        <Heading className={`m-0 text-2xl font-extrabold mb-6`}>Tisztelt {invoice.data.customer.name}!</Heading>
        <Text className={`m-0 mb-4 font-bold`}>Új számlát állítottak ki az ön részére!</Text>
        <Text className={`m-0 mb-1`}>Kiállító adatai:</Text>
        <Text className={`m-0`}>{invoice.data.supplier.name}</Text>
        <Text className={`m-0`}>{invoice.data.supplier.zip} {invoice.data.supplier.city}, {invoice.data.supplier.address}</Text>
        <Text className={`m-0 mb-6`}>{invoice.data.supplier.taxnumber}</Text>
        <Text className={`m-0`}>Az számla teljes tartalmát a mellékletben csatolt PDF fájl tartalmazza!</Text>
      </Section>

      {customHtml && customHtml.length > 0 && (
        <>
          <Hr />
          <Section className=" p-6">
            <Heading className={`m-0 font-extrabold mb-2`}>Kiállító üzenete:</Heading>
            <div dangerouslySetInnerHTML={{ __html: customHtml }} />
          </Section>
        </>
      )}

      <Hr />
      <Section className={`bg-slate-50 p-6 text-sm`}>
        <Text className={`m-0 text-slate-400 text-sm`}>Ezt az e-mailt a DokMester szolgáltatásával küldték. Kárjük ne válaszoljon erre az e-mail-re.</Text>
        <Link href={`https://dokmester.com`} className={`m-0 text-curious-blue-500 text-sm`}>dokmester.com</Link>
      </Section>
    </Container>
  </Tailwind>
);

export default NewInvoiceMail;