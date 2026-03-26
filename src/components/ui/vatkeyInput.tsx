import { NumericFormat, PatternFormatProps } from "react-number-format";
import { Input } from "./inpt";

const VatkeyInput = ({ onChange, ...props }: Omit<PatternFormatProps, "format">) => {

  return (
    <NumericFormat
      customInput={Input}
      {...props}
      onValueChange={(e) => {
        onChange && (onChange as any)(e.value)
      }}
      suffix={"%"}
    />
  )
};

export default VatkeyInput