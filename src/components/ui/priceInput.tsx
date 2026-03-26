import { CurrencyCode } from "@/types";
import { NumericFormat, PatternFormatProps } from "react-number-format";
import { Input } from "./inpt";

const PriceInput = ({ onChange, currency = "HUF", ...props }: Omit<PatternFormatProps, "format"> & { currency?: CurrencyCode }) => {

  return (
    <NumericFormat
      customInput={Input}
      {...props}
      onValueChange={(e) => {
        onChange && (onChange as any)(e.value)
      }}
      suffix={` ${new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currencyDisplay: "symbol",
        currency,
        maximumFractionDigits: 0,
      }).resolvedOptions().currency}`}
      thousandSeparator=" "
    />
  )
};

export default PriceInput