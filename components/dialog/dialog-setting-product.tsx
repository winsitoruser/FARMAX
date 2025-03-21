import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from 'lucide-react';
import React from "react";

interface Field {
  composition: boolean;
  sideEffect: boolean;
  indication: boolean;
  attention: boolean;
  usedBy: boolean;
  benefit: boolean;
  howToUse: boolean;
  drugInteractions: boolean;
  dose: boolean;
  posology: boolean;
}

interface Props {
  stateField: Field;
  setStateField: React.Dispatch<React.SetStateAction<Field>>;
}

const fieldNames: (keyof Field)[] = [
  "composition",
  "sideEffect",
  "indication",
  "attention",
  "usedBy",
  "benefit",
  "howToUse",
  "drugInteractions",
  "dose",
  "posology",
];

export const DialogSettingProduct: React.FC<Props> = ({ stateField, setStateField }) => {
  const handleCheckboxChange = (field: keyof Field) => {
    setStateField((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <Settings className='text-primary' />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Input Field</DialogTitle>
          <DialogDescription>
            Checklist box field untuk menambahkan field input.
          </DialogDescription>
        </DialogHeader>
        {fieldNames.map((fieldName) => (
          <div key={fieldName} className="flex items-center space-x-2">
            <Checkbox checked={stateField[fieldName]} onCheckedChange={() => handleCheckboxChange(fieldName)} />
            <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
              Tambah {fieldName.replace(/([A-Z])/g, ' $1').trim()}
            </label>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};
