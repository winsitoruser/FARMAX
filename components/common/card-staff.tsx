/* eslint-disable @next/next/no-img-element */
import { TypeAppoimentStaff } from '@/types/staff';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

type Staff = {
  data: TypeAppoimentStaff
}
const CardStaff: React.FC<Staff> = ({ data }) => {
  return (
      <div className='flex flex-row justify-between items-center p-3 shadow-md rounded-xl'>
        <div className='flex items-center gap-6'>
        <div className='p-1 rounded-full bg-primary'>
          <img src={data.image_id} alt={data.id} className='w-12 h-12 rounded-full' />
          </div>
          <div className='flex flex-col'>
            <p className='text-slate-800 font-medium text-base mb-1'>
            {data.full_name}
            </p>
          <span className='text-slate-500 text-sm capitalize font-normal'>{data.job}</span>
          </div>
        </div>
      <div className='text-slate-600 text-sm'>
        {format(new Date(data.startTime), 'eeee, dd MMMM yyyy', { locale: idLocale })}
        </div>
    </div>
  );
};

export default CardStaff;
