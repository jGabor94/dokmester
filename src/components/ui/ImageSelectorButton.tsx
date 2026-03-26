"use client";

import { cn } from "@/utils/cn";
import { ChangeEventHandler, DetailedHTMLProps, FC, LabelHTMLAttributes, useRef } from "react";

interface Props extends Omit<DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>, "onChange"> {
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const ImageSelectorButton: FC<Props> = ({ onChange, children, className, ...labelProps }) => {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        onChange(event);

        // Reseteli az input mezőt, így a felhasználó újra kiválaszthatja ugyanazt a fájlt
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <label
            {...labelProps}
            className={cn("inline-flex items-center px-4 py-2 font-semibold rounded-lg cursor-pointer", className)}
        >
            {children}
            <input hidden id="image" accept="image/*" multiple type="file" onChange={handleChange} ref={inputRef} />
        </label>
    );
};

export default ImageSelectorButton;
