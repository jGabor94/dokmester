"use client"

import { Button } from '@/components/ui/btn'
import { zodResolver } from '@hookform/resolvers/zod'
import { SaveIcon } from 'lucide-react'
import { Dispatch, FC, SetStateAction } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { SA_EditItem } from '../actions'
import { itemSchema } from '../lib/zodSchema'
import { ItemInput, SelectItems } from '../utils/types'
import DeleteItem from './DeleteItem'
import ItemForm from './ItemForm'

const EditItemRow: FC<{ item: SelectItems, setMode: Dispatch<SetStateAction<"read" | "edit">> }> = ({ item, setMode }) => {

  const form = useForm<ItemInput>({
    defaultValues: { name: item.name, unitPrice: item.unitPrice, unit: item.unit, vatkey: item.vatkey },
    resolver: zodResolver(itemSchema),
    mode: "all"
  });

  const onSubmit: SubmitHandler<ItemInput> = async (data) => {

    const res = await SA_EditItem(item.id, data)

    if (res.statusCode === 200) {
      toast.success('Tétel szerkesztve!');
      setMode("read")
      form.reset();
    } else if (res.statusCode === 400) {
      toast.error("Hibás adatok!");
    } else {
      toast.error(res.statusMessage);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className={`border p-3 rounded-2xl relative grid grid-cols-6 text-left gap-4 bg-card shadow-sm`}>
        <ItemForm form={form} prefix='' />
        <div className={`col-start-1 col-end-7 ms-auto me-0 flex items-end gap-4`}>
          <Button type="submit" className={`flex gap-2`} loading={form.formState.isSubmitting}><SaveIcon strokeWidth={1.5} /><span>Mentés</span></Button>
          <DeleteItem itemID={item.id} />
        </div>
      </div>
    </form>
  )
}

export default EditItemRow