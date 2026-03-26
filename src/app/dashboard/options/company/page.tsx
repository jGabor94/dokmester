import { auth } from "@/features/authentication/lib/auth";
import EditCompanyForm from "@/features/company/components/EditCompanyForm";
import { getFullCompany } from "@/features/company/queries/getCompany";
import UpdateNavData from "@/features/navApi/components/UpdateNavData";
import { redirect } from "next/navigation";
import { FC } from "react";

const CompanyPage: FC<{}> = async () => {

  const session = await auth()
  if (!session || !session.user.companyID) return redirect("/")
  const company = await getFullCompany(session.user.companyID)


  if (company) {
    return (
      <>
        <section className="mb-4">
          <header className={`mb-4 text-center md:mb-8 md:text-start`}>
            <h1 className={`font-bold text-4xl`}>Cégem adatai</h1>
          </header>
          <div className="flex flex-col gap-4 md:max-w-lg">
            <div className={`border p-3 rounded-2xl bg-card shadow-sm`}>
              <EditCompanyForm company={company} />
            </div>
            <UpdateNavData initNavData={company.navData} />
          </div>

        </section>
      </>
    )
  }
}

export default CompanyPage




