"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import Spinner from "@/components/ui/spinner"
import { FC, useEffect, useState } from 'react'
import { SA_UpdateDocument } from "../actions"
import { DocStatus } from '../lib/types/document'

const UpdateDocument: FC<{ status: DocStatus, docID: string }> = ({ status: initStatus, docID }) => {

  const [status, setStatus] = useState(initStatus)
  const [loading, setLoading] = useState(false)

  const onChange = async (value: DocStatus) => {
    setStatus(value)
    setLoading(true)
    await SA_UpdateDocument(docID, value)
    setLoading(false)
  }

  useEffect(() => {
    setStatus(initStatus)
  }, [initStatus])

  return (
    <div className="flex flex-row items-center gap-2">
      <Select onValueChange={onChange} value={status} disabled={loading}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Válassz Státuszt" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="pending">Függőben</SelectItem>
            <SelectItem value="sended">Elküldve</SelectItem>
            <SelectItem value="accepted">Elfogadva</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Spinner className={`w-5 h-fit  ${loading ? "visible" : "invisible"}`} />

    </div>
  )
}

export default UpdateDocument