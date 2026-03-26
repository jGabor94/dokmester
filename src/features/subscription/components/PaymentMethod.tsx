import { auth } from '@/features/authentication/lib/auth'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import CardForm from './CardForm'
import CardMenu from './CardMenu'
import CardRow from './CardRow'
import { getPaymentMethods } from '../queries'

const PaymentMethod: FC<{ subID?: string, defaultPaymentMethod?: string }> = async ({ subID, defaultPaymentMethod }) => {

  const session = await auth()
  if (!session || !session.user.customerID) return redirect("/")

  const paymentMethods = await getPaymentMethods(session.user.customerID);

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      {paymentMethods.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Kártyáim</span>
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="flex flex-row items-center justify-between">
              <CardRow {...{ defaultPaymentMethod, pm }} />
              <CardMenu pm={pm} subID={subID} />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="font-semibold">Új kártya hozzáadása</span>
        <CardForm />
      </div>
    </div>

  )
}

export default PaymentMethod