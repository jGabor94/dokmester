"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FC } from 'react'
import toast from "react-hot-toast"
import { SA_CompanyChange } from "../actions"
import { SelectCompany } from "../utils/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const CompanySelector: FC<{ companies: SelectCompany[], currentcompanyid: string }> = ({ companies, currentcompanyid }) => {

  const handleChange = async (value: string) => {
    const res = await SA_CompanyChange(value)
    if (res.statusCode === 200) {
      toast.success('Cégváltás sikeres');
      location.reload();
    } else {
      toast.error(res.statusMessage);
    }
  }

  return (
    <Select onValueChange={handleChange} defaultValue={currentcompanyid}>
      <SelectTrigger className={`p-0 border-none shadow-none`}>
        <SelectValue placeholder="Válassz céget" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cég váltás</SelectLabel>
          {companies.map(company => (
            <SelectItem key={company.id} value={company.id}>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/images/${company.logo}`} alt={company.name} />
                  <AvatarFallback className="text-foreground">{company.name && company.name.split(' ')[0][0] + company.name.split(' ')[1][0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{company.name}</span>
                  <span className="truncate text-xs">{company.taxnumber}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default CompanySelector