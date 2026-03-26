import { Container, Heading, Hr, Img, Link, Section, Tailwind, Text } from "@react-email/components";
import { tailwindEmailConfig } from "../utils/tailwind";
import { AcceptedDocumentType } from "../utils/types";
import { docNameMap } from "@/features/documents/utils/docTanslations";
import { DocType } from "@/features/documents/lib/types/document";

export const AcceptDocument = ({ issuerName, docName, docType, docCreated }: AcceptedDocumentType) => (
  <Tailwind config={tailwindEmailConfig} >
    <Container className={`bg-slate-50 text-slate-950 my-0 mx-auto`}>
      <Section className={`bg-curious-blue-500 mb-0`}>
        <Img src={`https://dokmester.com/Banner_White.png`} width={159} height={30} alt="DokMester Banner" className={`mx-auto my-4`} />
      </Section>
      <Section className={`bg-slate-50 p-6`}>
        <Heading className={`m-0 text-2xl font-extrabold mb-6`}>Tisztelt {issuerName}!</Heading>
        <Text className={`m-0 mb-4 font-bold`}>Az Ön által kiállított dokumentumot elfogadták!</Text>
        <Text className={`m-0 mb-1`}>Dokumentum adatai:</Text>
        <Text className={`m-0`}>{docNameMap[docType as DocType]}</Text>
        <Text className={`m-0`}>{docName}</Text>
        <Text className={`m-0 mb-6`}>{docCreated.toLocaleDateString('hu-HU')}</Text>
        <Text className={`m-0`}>A dokumentumot az alábbi linkre kattintva tekintheti meg a DokMesteren belül!</Text>
        <Text><Link href={`${process.env.BASE_URL}/dashboard/documents?search=${docName}`}>Dokumentum megnyitása</Link></Text>
      </Section>
      <Hr />
      <Section className={`bg-slate-50 p-6 text-sm`}>
        <Text className={`m-0 text-slate-400 text-sm`}>Ezt az e-mailt a DokMester szolgáltatásával küldték. Kárjük ne válaszoljon erre az e-mail-re.</Text>
        <Link href={`https://dokmester.com`} className={`m-0 text-curious-blue-500 text-sm`}>dokmester.com</Link>
      </Section>
    </Container>
  </Tailwind>
);