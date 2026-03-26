
import { auth } from "@/features/authentication/lib/auth";
import { getFullCompany } from "@/features/company/queries/getCompany";
import CreatePartner from "@/features/partners/components/CreatePartner";
import PartnerList from "@/features/partners/components/list";
import getPartners from "@/features/partners/queries";
import { redirect } from "next/navigation";
import { FC } from "react";


const PartnersPage: FC<{}> = async () => {

  const session = await auth()

  if (!session || !session.user.companyID) redirect("/")

  const company = await getFullCompany(session?.user.companyID)
  const partners = await getPartners(session?.user.companyID)

  if (company) {
    return (
      <>
        <section>
          <header className={`mb-4 text-center md:text-start`}>
            <h1 className={`font-bold text-4xl`}>Partnerek</h1>
          </header>
          <div className={`mb-4 flex gap-4`}>
            <CreatePartner />
          </div>
          <PartnerList partners={partners} />
        </section>
      </>
    )
  }
}

export default PartnersPage