'use client'

import { Button, buttonVariants } from "@/components/ui/btn";
import { Input } from "@/components/ui/inpt";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { SA_SignIn } from "../actions";

const LoginForm = () => {
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const res = await SA_SignIn(formData.get("email") as string, formData.get("password") as string)

    if (res.success) {
      toast.success(`Sikeres bejelentkezés!`);
      router.push('/dashboard');
    } else {
      toast.error(`Hibás adatok!`);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={`grid gap-4 border shadow-sm p-3 bg-card rounded-2xl max-w-md w-full mx-auto`}>
        <h1 className={`font-bold text-2xl`}>Jó, hogy újra látunk!</h1>
        <div>
          <label htmlFor={`email`} className={`block mb-1 text-xs`}>E-mail cím</label>
          <Input type="text" name="email" id="email" placeholder={`E-mail cím`} className={`w-full`} />
        </div>
        <div>
          <label htmlFor={`password`} className={`block mb-1 text-xs`}>Jelszó</label>
          <Input type="password" name="password" id="password" placeholder={`Jelszó`} className={`w-full`} />
        </div>
        <Button type="submit" className={`w-max`}>Bejelentkezem</Button>
        <Link href={`/password/reset`} className={`${buttonVariants({ variant: 'link' })} w-max me-0 ms-auto`}>Elfelejtettem a jelszavam</Link>
      </form>
    </>
  )
}

export default LoginForm