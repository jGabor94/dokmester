'use client'

import { Button } from "@/components/ui/btn";
import { XIcon } from "lucide-react";
import { FC } from "react";
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { ItemInput, ItemInputs } from "../utils/types";
import ItemForm from "./ItemForm";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { SA_CreateItems } from "../actions";
import { itemsFormSchema } from "../lib/zodSchema";

const initRow: ItemInput = {
  name: '',
  unitPrice: 0,
  unit: '',
  vatkey: "27%",
  type: "PRODUCT",
}

const CreateItems: FC<{ companyID: string }> = ({ companyID }) => {

  const form = useForm<ItemInputs>({
    defaultValues: { items: [] },
    resolver: zodResolver(itemsFormSchema),
    mode: "all"
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
    rules: { required: true },
  });


  const onSubmit: SubmitHandler<ItemInputs> = async ({ items }) => {

    console.log({ items })


    const res = await SA_CreateItems(companyID, items)

    if (res.statusCode === 200) {
      toast.success('Tétel hozzáadva!');
      form.reset();
    } else if (res.statusCode === 400) {
      toast.error("Hibás adatok!");
    } else {
      toast.error(res.statusMessage);
    }

  }


  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 ">
        {fields.map((field, index) => (
          <div className='border-2 p-3 rounded-2xl relative flex flex-row items-center gap-3 bg-card' key={field.id}>
            <XIcon className="absolute top-2 right-2 cursor-pointer" onClick={() => remove(index)} />
            <ItemForm form={form} prefix={`items.${index}.`} />
            {index < fields.length - 1 && <div className="border-t border-gray-300 my-4" />}
          </div>
        ))}
        <div className='flex flex-row gap-2'>
          <Button type={`submit`} loading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting} >Mentés</Button>
          <Button variant="outline" onClick={() => append(initRow)}>Hozzáadás</Button>
        </div>
      </div>

    </form >
  )
}

export default CreateItems