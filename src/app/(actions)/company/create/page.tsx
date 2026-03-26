import CreateCompany from '@/features/company/components/CreateCompany';
import { getPlans } from '@/features/subscription/queries';
import { FC } from 'react';

const page: FC<{}> = async () => {
  const plans = await getPlans();
  return <CreateCompany plans={plans} />
}

export default page