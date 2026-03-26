import { PatternFormat, PatternFormatProps } from "react-number-format";
import { Input } from "./inpt";

const TaxNumberInput = ({ onChange, ...props }: Omit<PatternFormatProps, "format">) => {

  const value = props.value?.toString().replace(/\D/g, "") || ""
  let pattern = "########"
  if (value.length > 8) {
    pattern = "########-#-##"
  } else if ((value.length > 7)) {
    pattern = "########-#"
  }

  return (
    <PatternFormat
      format={pattern}
      customInput={Input}
      allowEmptyFormatting={false}
      {...props}
      onValueChange={(e) => {
        onChange && (onChange as any)(e.formattedValue)
      }}

    />
  )
};

export default TaxNumberInput