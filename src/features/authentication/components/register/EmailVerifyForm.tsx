"use client"

import { Button } from "@/components/ui/btn"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { SA_SendVerifyCode } from "@/features/email/actions"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Dispatch, FC, SetStateAction, useState } from 'react'
import toast from "react-hot-toast"
import { RegisterForm } from '../../utils/types'

const EmailVerifyForm: FC<{
  setPage: Dispatch<SetStateAction<number>>,
  submitValues: RegisterForm
}> = ({ setPage, submitValues }) => {

  const [isPending, setIsPending] = useState(false)

  const [generatedCode, setGeneratedCode] = useState<null | string>(null)
  const [code, setCode] = useState<string>("")

  const sendCode = async () => {
    setIsPending(true)
    const res = await SA_SendVerifyCode(submitValues.user.email, submitValues.user.name)

    if (res.statusCode === 200) {
      setGeneratedCode(res.payload.toString())
      toast.success("Megerősítő kód elküldve!");
    } else {
      toast.error(res.statusMessage);
    }
    setIsPending(false)

  }

  const handleNext = () => {
    if (code === generatedCode) {
      setPage(4)
    } else {
      toast.error("Hibás megerősítő kód")
    }
  }

  return (

    <div className="flex flex-col gap-4">
      <div className={`self-start flex items-end gap-4`}>
        <div>
          <label htmlFor={`company`} className={`block mb-2 text-xs text-start`}>Megerősítő kód</label>
          <InputOTP id="code" maxLength={6} pattern={REGEXP_ONLY_DIGITS} onChange={e => setCode(e)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button onClick={sendCode} disabled={isPending} >Kód küldése</Button>
      </div>
      <div className={`grid grid-cols-2 gap-4 justify-center items-center`}>
        <Button type="button" className={`block w-full min-w-full`} variant={'outline'} onClick={() => setPage(state => state - 1)}>Vissza</Button>
        <Button className={`block w-full min-w-full`} onClick={handleNext}>Tovább</Button>
      </div>
    </div>
  )
}

export default EmailVerifyForm