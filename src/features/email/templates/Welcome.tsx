import { WelcomeType } from "../utils/types";
import { tailwindEmailConfig } from "../utils/tailwind";
import { Button, Container, Heading, Img, Section, Tailwind, Text } from "@react-email/components";

export const WelcomeEmail = ({ name } : WelcomeType) => (
  <Tailwind config={tailwindEmailConfig} >
    <Container className={`bg-slate-50 text-slate-950 my-0 mx-auto rounded-2xl overflow-hidden border`}>
      <Section className={`bg-curious-blue-500 mb-0`}>
        <Img src={`https://dokmester.com/Banner_White.png`} width="231" height="32" alt="DokMester Banner" className={`mx-auto my-4`}/>
      </Section>
      <Section className={`bg-slate-50 p-6`}>
        <Heading className={`text-4xl font-extrabold mb-6`}>Üdvözlünk {name}!</Heading>
        <Text className={`mt-0 mb-2 font-bold`}>Köszönjük, hogy regisztráltál a DokMesterbe!</Text>
        <Text className={`mt-0 mb-12`}>Fedezd fel a DokMester nyújtotta lehetőségeit a vállalkozásod számára - legyen itt szó árajánlatról, számláról, és még sok másról!</Text>
        <Button href={`https://dokmester.com/dashboard`} className="bg-curious-blue-500 px-4 py-3 font-bold text-white rounded-lg" >
          Vágjunk bele
        </Button>
      </Section>
    </Container>
  </Tailwind>
);

