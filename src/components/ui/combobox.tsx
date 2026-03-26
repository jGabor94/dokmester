"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { FC, useState } from 'react'
import { Button } from './btn'


const Combobox: FC<{
  id?: string,
  value: string,
  options: readonly { value: string, label: string }[] | { value: string, label: string }[],
  onChange: (...event: any[]) => void,
  placeholder?: string,
  renderItem?: (option: { value: string, label: string }) => any,
  buttonClassname?: string
}> = ({ id, value, options, onChange, placeholder, renderItem, buttonClassname }) => {

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", buttonClassname)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command filter={(optionValue, search) => {
          const sanitizedSearch = search.replace(
            /[-\/\\^$*+?.()|[\]{}]/g,
            '\\$&'
          )

          const searchRegex = new RegExp(sanitizedSearch, 'i')

          const option = options.find((opt) => opt.value === optionValue)
          if (!option) return 0

          const labelMatch = searchRegex.test(option.label)
          const valueMatch = searchRegex.test(option.value)

          return labelMatch || valueMatch ? 1 : 0
        }}>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>Elem nem található</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  id={id}
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}

                >

                  {renderItem ? renderItem(option) : option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox