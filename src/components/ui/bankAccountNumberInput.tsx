import { PatternFormat, PatternFormatProps } from "react-number-format";
import { Input } from "./inpt";

const BankAccountNumberInput = ({ onChange, ...props }: Omit<PatternFormatProps, "format">) => {
  const value = props.value?.toString().replace(/\D/g, "") || ""

  let pattern = "#########"
  if (value.length < 17 && value.length > 8) {
    pattern = "########-#########"
  } else if (value.length > 16) {
    pattern = "########-########-########"
  }

  return (
    <PatternFormat
      format={pattern}
      customInput={Input}
      allowEmptyFormatting={false}
      {...props}
      onValueChange={(e) => {
        console.log(e.formattedValue)
        onChange && (onChange as any)(e.formattedValue.trimEnd())
      }}

    />
  )
};

export default BankAccountNumberInput