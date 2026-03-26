"use client"

import ImageSelectorButton from "@/components/ui/ImageSelectorButton";
import { cn } from "@/lib/utils";
import { CircleMinus, ImageUp } from "lucide-react";
import NextImage from 'next/image';
import { ChangeEventHandler, FC } from "react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { v4 as uuidv4 } from 'uuid';
import { RawImage, imageValidationCfg } from "../utils/types";
import validateImage from "../utils/validateImage";
import { ValidationErrors } from "../utils/validationError";

interface ImageSelectorProps {
    className?: string,
    onChange: (imageList: RawImage[]) => void,
    validation: imageValidationCfg,
    value: RawImage[],
    onRemove: (index: number) => void,
    onError: (errors: string[]) => void
}

const ImageSelector: FC<ImageSelectorProps> = ({ onChange, validation, value: images = [], onRemove, onError, className }) => {

    const handleAdd: ChangeEventHandler<HTMLInputElement> = async (e) => {

        if (e.target.files) {
            const { images: newImages, errors } = Array.from(e.target.files).slice(0, validation.imageNumber || e.target.files.length).reverse().reduce((acc, file) => {
                try {
                    validateImage(file, validation)
                    return {
                        ...acc, images: [...acc.images, {
                            previewUrl: URL.createObjectURL(file),
                            key: uuidv4(),
                            file
                        }]
                    }
                } catch (error) {
                    if (error instanceof ValidationErrors) {
                        return { ...acc, errors: [...new Set([...acc.errors, ...error.messages])] }
                    } else {
                        return acc
                    }
                }
            }, { images: [], errors: [] } as { images: RawImage[], errors: string[] });
            onChange([...images, ...newImages])
            errors.length > 0 && onError(errors)
        }
    }

    const handleRemove = (index: number) => {
        onRemove(index)
    }

    return (
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 w-full", validation?.imageNumber === 1 && "grid-cols-1  md:grid-cols-1", className)}>
            <PhotoProvider>
                {images && images.map((image, index) => (
                    <PhotoView key={index} src={image.previewUrl}>

                        <div key={index} className="aspect-square relative width-full" >
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent opacity-0 hover:opacity-100 z-50 transition-opacity duration-300 rounded-lg">
                                <CircleMinus
                                    className="text-white absolute z-10 right-2 top-2 cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); handleRemove(index) }}
                                    strokeWidth={'1.5'}
                                />
                            </div>
                            <NextImage src={image.previewUrl} alt="" fill sizes='20vw' className="object-cover rounded-lg" />
                        </div>
                    </PhotoView>

                ))}
            </PhotoProvider>
            {(!validation.imageNumber || validation.imageNumber > images.length) && (
                <ImageSelectorButton onChange={handleAdd} className='aspect-square width-full height-full flex flex-col gap-1 cursor-pointer border-2 border-slate-200 justify-center items-center hover:border-slate-300 transition-all duration-300'>
                    <ImageUp strokeWidth={'1.5'} />
                </ImageSelectorButton>
            )}



        </div>



    )
}

export default ImageSelector