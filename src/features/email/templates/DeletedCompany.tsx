import { Container, Heading, Hr, Img, Link, Section, Tailwind, Text } from "@react-email/components";
import { tailwindEmailConfig } from "../utils/tailwind";

export const DeletedCompany = (name: string, companyName: string) => (
  <Tailwind config={tailwindEmailConfig} >
    <Container className={`bg-slate-50 text-slate-950 my-0 mx-auto`}>
      <Section className={`bg-curious-blue-500 mb-0`}>
        <Img src={`https://dokmester.com/Banner_Web_White.png`} width="231" height="32" alt="DokMester Banner" className={`mx-auto my-4`} />
      </Section>
      <Section className={`bg-slate-50 p-6`}>
        <Heading className={`m-0 text-2xl font-extrabold mb-6`}>Tisztelt {name}!</Heading>
        <Text className={`m-0 mb-4 `}>Sajnálattal értesítjük hogy az alábbi cég, melynek ön tagja volt, megszűnt:</Text>
        <Text className="mt-4 text-sm text-slate-600">
          {companyName}
        </Text>
      </Section>
      <Hr />
      <Section className={`bg-slate-50 p-6 text-sm`}>
        <Text className={`m-0 text-slate-400 text-sm`}>Ezt az e-mailt a DokMester szolgáltatásával küldték. Kárjük ne válaszoljon erre az e-mail-re.</Text>
        <Link href={`https://dokmester.com`} className={`m-0 text-curious-blue-500 text-sm`}>dokmester.com</Link>
      </Section>
    </Container>
  </Tailwind>
);