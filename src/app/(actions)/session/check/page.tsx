import Success from "@/components/Success"
import Checkout from "@/features/subscription/components/Checkout"
import { getCheckoutSession } from "@/features/subscription/queries"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Regisztráció - DokMester',
}

const Page = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {

  const { session_id } = await searchParams;

  if (session_id) {
    const { status, customerID, planID } = await getCheckoutSession(session_id)

    return (
      <>
        {status === "complete" ? (
          <Success title="Sikeres fizetés" />
        ) : status === "expired" ? (
          <div>
            {customerID && planID && (
              <Checkout {...{ customerID, planID, returnPath: `/session/check?session_id={CHECKOUT_SESSION_ID}`, mode: "subscription" }} />
            )}
          </div >
        ) : (
          <p className='text-3xl'>Munkamenet lejárt</p>
        )}
      </>
    )
  }

}

export default Page