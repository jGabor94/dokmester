import Register from "@/features/authentication/components/register";
import { getPlans } from "@/features/subscription/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Regisztráció - DokMester',
}

const RegisterPage = async () => {
  const plans = await getPlans();
  return <Register plans={plans} />
}

export default RegisterPage