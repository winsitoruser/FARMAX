import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface ComboBoxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: any[];
  getOptionLabel: (option: any) => string | undefined;
  selectedValue: string;
  className?: string;
  onSelect?: (option: any) => void;
  disabled?: boolean;
}

const ComboBox = ({
  options,
  getOptionLabel,
  selectedValue,
  className,
  onSelect,
  disabled,
  ...props
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const debouncedSelectedValue = useDebounce(selectedValue, 500);

  const splitLabel = (label: string, delimiter: string): [string, string] => {
    const index = label.indexOf(delimiter);
    if (index !== -1) {
      return [label.slice(0, index).trim(), label.slice(index + delimiter.length).trim()];
    } else {
      return [label, ''];
    }
  };


  const selectedOptionLabel = useMemo(() => {

    if (!debouncedSelectedValue) {
      return "Select option...";
    }

    const selectedOption = options.find((option) => {
      const label = getOptionLabel(option);

      const delimiters = ['-', '/', ' '];
      for (const delimiter of delimiters) {
        const [labelOne, labelTwo,] = splitLabel(String(label), delimiter);
        if (labelOne === debouncedSelectedValue) {
          return true;
        }
      }
      return false;
    });

    return selectedOption ? getOptionLabel(selectedOption) : "Select option...";
  }, [options, debouncedSelectedValue, getOptionLabel]);

  const memoizedGetOptionLabel = useCallback((option: any) => getOptionLabel(option), [getOptionLabel]);

  const memoizedOnSelect = useCallback(
    (option: any) => {
      onSelect && onSelect(option);
      setOpen(false);
    },
    [onSelect]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
          {...props}
        >
          {selectedOptionLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full" side="bottom" sideOffset={7}>
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandEmpty>No options found.</CommandEmpty>
          <ScrollArea className="max-h-72">
            <CommandGroup>
            {options.map((option, index) => (
              <CommandItem key={index} onSelect={() => memoizedOnSelect(option)} className="capitalize">
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    memoizedGetOptionLabel(option) === debouncedSelectedValue
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {memoizedGetOptionLabel(option)}
              </CommandItem>
            ))}
          </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
