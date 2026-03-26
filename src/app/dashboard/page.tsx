import { auth } from '@/features/authentication/lib/auth';
import DocumentChart from '@/features/charts/components/DocumentChart';
import { getChartData } from '@/features/charts/queries';

const DashboardPage = async () => {
  const session = await auth();

  const chartDatav2 = await getChartData(session?.user.companyID as string, '2025');




  const chartData = [
    {
      'DEN': {
        'Január': 11,
        'Február': 3,
        'Március': 23,
        'Április': 43,
        'Május': 34,
      },
    },
    {
      'BID': {
        'Január': 22,
        'Február': 33,
        'Március': 76,
        'Április': 10,
        'Május': 0,
      }
    }
  ]

  return (
    <section>
      <header className={`flex justify-between items-center mb-8`}>
        <h1 className={`font-bold text-4xl`}>Vezérlőpult</h1>
      </header>
      {session?.user.companyID ? (
        <section className={`grid grid-cols-5 gap-4 items-center`}>
          {chartData.map((data, i) => (
            <DocumentChart data={data} key={i} />
          ))}
        </section>
      ) : (
        <section className={`flex gap-4 items-center w-full`}>
          <div className={`w-2/3`}>
            <p className='text-4xl'>Jelenleg nem vagy tagja egyetlen szerveztnek sem.</p>
          </div>
        </section>
      )}

    </section>
  )
}

export default DashboardPage