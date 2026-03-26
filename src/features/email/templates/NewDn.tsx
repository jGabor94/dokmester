import { SelectDocument } from "@/features/documents/lib/types/document";
import { Container, Heading, Hr, Img, Link, Section, Tailwind, Text } from "@react-email/components";
import jwt from "jsonwebtoken";
import { tailwindEmailConfig } from "../utils/tailwind";

export const NewDnMail = (doc: SelectDocument, customHtml?: string) => (

  <Tailwind config={tailwindEmailConfig} >
    <Container className={`bg-slate-50 text-slate-950 my-0 mx-auto`}>
      <Section className={`bg-curious-blue-500 mb-0`}>
        <Img src={`https://dokmester.com/Banner_Web_White.png`} width="231" height="32" alt="DokMester Banner" className={`mx-auto my-4`} />
      </Section>
      <Section className={`bg-slate-50 p-6`}>
        <Heading className={`m-0 text-2xl font-extrabold mb-6`}>Tisztelt {doc.data.applicant.name}!</Heading>
        <Text className={`m-0 mb-4 font-bold`}>Új szállítólevelet állítottak ki az Ön részére!</Text>
        <Text className={`m-0 mb-1`}>Kiállító adatai:</Text>
        <Text className={`m-0`}>{doc.data.issuer.name}</Text>
        <Text className={`m-0`}>{doc.data.applicant.zip} {doc.data.applicant.city}, {doc.data.applicant.address}</Text>
        <Text className={`m-0 mb-6`}>{doc.data.applicant.taxnumber}</Text>
        <Text className={`m-0`}>Az szállítólevél teljes tartalmát a mellékletben csatolt PDF fájl tartalmazza!</Text>
        <Link href={`${process.env.BASE_URL}/accept/document/${jwt.sign({ docID: doc.id, type: doc.type }, process.env.JWT_SECRET as string, {
          algorithm: "HS256",
          expiresIn: 60 * 60 * 24 * 7
        })}`}>Elfogadás</Link>
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