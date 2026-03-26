import { auth } from "@/features/authentication/lib/auth"
import CreateItems from "@/features/items/components/CreateItems"
import ItemList from "@/features/items/components/ItemList"
import getItems from "@/features/items/queries/getItems"
import { redirect } from "next/navigation"

const ServicesPage = async () => {

  const session = await auth();
  if (!session || !session.user.companyID) return redirect("/")

  const items = await getItems(session.user.companyID as string);

  return (
    <section>
      <header className={`flex justify-between items-center mb-8`}>
        <h1 className={`font-bold text-4xl`}>Tételek</h1>
      </header>
      <div className="grid gap-4">
        <div>
          <CreateItems companyID={session.user.companyID} />
        </div>
        <div>
          <ItemList {...{ items }} />
        </div>
      </div>
    </section>
  )
}

export default ServicesPage