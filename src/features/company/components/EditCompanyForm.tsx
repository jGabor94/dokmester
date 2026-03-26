'use client'

import { Button } from "@/components/ui/btn"
import { Input } from "@/components/ui/inpt"
import Spinner from "@/components/ui/spinner"
import TaxNumberInput from "@/components/ui/taxNumberInput"
import ImageSelector from "@/features/image/components/ImageSelector"
import { allowedImageExtenstions, allowedImageSize } from "@/features/image/lib/imageExtensions"
import imagePreparation from "@/features/image/utils/imagePreparation"
import { RawImage } from "@/features/image/utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { SA_UpdateCompany } from "../actions"
import { companyFormSchema } from "../lib/zodSchema"
import { CompanyInputs, SelectCompany } from "../utils/types"

const EditCompanyForm: FC<{ company: SelectCompany }> = ({ company }) => {

  const [logo, setLogo] = useState<RawImage[]>(company.logo !== "default" ? [{ previewUrl: `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/images/${company.logo}`, key: company.logo }] : [])

  const form = useForm<CompanyInputs>({
    mode: "all",
    defaultValues: {
      name: company.name,
      taxnumber: company.taxnumber,
      zip: company.zip,
      city: company.city,
      address: company.address,
      color: company.color ?? '#13a4ec',
      monogram: company.monogram
    },
    resolver: zodResolver(companyFormSchema, {}),
  });

  const onSubmit: SubmitHandler<CompanyInputs> = async (data) => {

    const preparedLogo = logo.length === 1 && logo[0].file ? await imagePreparation(logo[0] as Required<RawImage>) : undefined
    const removedLogo = ((company.logo !== "default") && (logo.length === 0 || (logo[0].key !== company.logo))) ? company.logo : undefined
    const res = await SA_UpdateCompany(data, preparedLogo, removedLogo)

    if (res.statusCode === 200) {
      toast.success('Céges adatok frissítve!');
    } else if (res.statusCode === 400) {
      toast.error("Hibás adatok!");
    } else {
      toast.error(res.statusMessage);
    }

  }

  const handleImageChange = (imageList: RawImage[]) => {
    setLogo(imageList)
  }

  const handleImageRemove = (index: number) => {
    setLogo(state => {
      const imageList = [...state]
      imageList.splice(index, 1)
      return imageList
    })

  }

  const handleError = (errors: string[]) => {
    toast.error((
      <ul className='list-disc pl-10'>
        {errors.map((error, index) => (
          <li key={index} className='text-sm mb-2'>
            {error}
          </li>
        ))}
      </ul>
    ), {
      duration: 6000,
      position: 'bottom-center',
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <div className={`grid grid-cols-2 gap-4`}>
          <div>
            <label className={`block mb-1 text-xs`} htmlFor={`name`}>Cégnév</label>
            <Input type={`text`} placeholder={`Név`} id={`name`} className={`w-full`} {...form.register('name')} />
          </div>
          <div>
            <label className={`block mb-1 text-xs`} htmlFor={`taxnumber`}>Adószám</label>
            <Controller
              name="taxnumber"
              control={form.control}
              render={({ field }) => (
                <TaxNumberInput {...field} id={`taxnumber`} />
              )}
            />
          </div>
        </div>
        <div className={`grid grid-cols-6 gap-4`}>
          <div className={`col-start-1 col-end-3`} >
            <label className={`block mb-1 text-xs`} htmlFor={`zip`}>Irányítószám</label>
            <Input type={`number`} placeholder={`1234`} id={`zip`} className={`w-full`} {...form.register('zip')} />
          </div>
          <div className={`col-start-3 col-end-7`}>
            <label className={`block mb-1 text-xs`} htmlFor={`city`}>Város</label>
            <Input type={`text`} placeholder={`Város`} id={`city`} className={`w-full`} {...form.register('city')} />
          </div>
        </div>
        <div>
          <label className={`block mb-1 text-xs`} htmlFor={`address`}>Utca, házszám</label>
          <Input type={`text`} placeholder={`Dokmester utca 100.`} id={`address`} className={`w-full`} {...form.register('address')} />
        </div>
        <div>
          <label className={`block mb-1 text-xs`} htmlFor={`monogram`}>Monogram (max 3 karakter)</label>
          <Input type={`text`} placeholder={`JR`} id={`monogram`} className={`w-full`} {...form.register('monogram')} />
        </div>
        <div className={`grid grid-cols-6 gap-4`}>
          <div className={`col-start-1 col-end-2`}>
            <label className={`block mb-1 text-xs`} htmlFor={`color`}>Szín</label>
            <Input type={`color`} id={`color`} className={`w-full`} {...form.register('color')} />
          </div>
          <div className={`col-start-2 col-end-7`}>
            <label className={`block mb-1 text-xs`} htmlFor={`file`}>Logó</label>

            <ImageSelector
              className="w-44"
              onChange={(imageList) => handleImageChange(imageList)}
              onRemove={(index) => handleImageRemove(index)}
              onError={handleError}
              value={logo}
              validation={{ extensions: allowedImageExtenstions, size: allowedImageSize, imageNumber: 1 }} />
          </div>


        </div>
        <div>
          <Button type={`submit`} disabled={!form.formState.isValid || form.formState.isSubmitting}>{form.formState.isSubmitting && <Spinner size={10} color="white" />}<span>Mentés</span></Button>
        </div>
      </div>
    </form>
  )
}

export default EditCompanyForm