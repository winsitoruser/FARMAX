import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface RenderIngredientsFieldProps {
  name: string;
  value: string;
}

interface InformasiProdukProps {
  ingredients: RenderIngredientsFieldProps[];
  sideEffects: string;
  indication: string;
  posology: string;
  dosage: string;
}

const RenderIngredientsField: React.FC<RenderIngredientsFieldProps> = ({ name, value }) => {
  if (!name || !value) {
    return (
      <li key={name}>
        <div className="flex items-baseline justify-between gap-1">
          <span>{name}</span>
          <div style={{ border: '1px dotted black', flexGrow: 1 }} />
          <span>{value}</span>
        </div>
      </li>
    );
  }

  return (
    <li key={name}>
      <div className="flex items-baseline text-sm justify-between gap-1">
        <span>{name}</span>
        <div style={{ border: '1px dotted black', flexGrow: 1 }} />
        <span>{value}</span>
      </div>
    </li>
  );
};

const ListLine = (line: string, index: number): React.ReactNode => {
  return (
    <li key={index}>
      {line.split("\r")[0]}
    </li>
  );
};

const ProductInformation: React.FC<InformasiProdukProps> = ({
  ingredients = [],
  sideEffects = '',
  indication = '',
  posology = '',
  dosage = '',
}) => {

  return (
    <Card>
      <div className="grid grid-cols-1">
        <CardHeader>
          <CardTitle className='text-slate-600'>KOMPOSISI</CardTitle>
        </CardHeader>
        <CardContent className='text-sm'>
          <ul className='space-y-1'>{ingredients.map(RenderIngredientsField)}</ul>
        </CardContent>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <CardHeader>
            <CardTitle className='text-slate-600'>INDIKASI</CardTitle>
          </CardHeader>
          <CardContent className='text-sm'>
            <span className='capitalize'>{indication}</span>
          </CardContent>
          <CardHeader>
            <CardTitle className='text-slate-600'>EFEK SAMPING
            </CardTitle>
          </CardHeader>
          <CardContent className='text-sm'>
            <ul className='list-disc ml-4'>
              {sideEffects ? (
                (sideEffects?.split("\n") || []).map((line, index) => ListLine(line, index))
              ) : (
                <li>Tidak Ada Efek Samping</li>
              )}
            </ul>
          </CardContent>
        </div>
        <div>
          <CardHeader>
            <CardTitle className='text-slate-600'>POSOLOGI</CardTitle>
          </CardHeader>
          <CardContent className='text-sm'>
            <span className='capitalize'>{posology}</span>
          </CardContent>
          <CardHeader>
            <CardTitle className='text-slate-600'>DOSIS</CardTitle>
          </CardHeader>
          <CardContent className='text-sm'>
            <ul className="list-disc ml-4">
              {dosage ? (
                (dosage?.split("\n") || []).map((line, index) => ListLine(line, index))) : (
                <li>Tidak Ada Dosis Info</li>
              )}
            </ul>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export default ProductInformation