import { Icons } from '@/components/common/Icons';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';

type Props = {
  setDateRange: React.Dispatch<React.SetStateAction<string>>,
  dateRange: string,
  calendarRef: any,
}

const HeaderScheduler: React.FC<Props> = ({ dateRange, setDateRange, calendarRef }) => {
  const nextHandle = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setDateRange(calendarApi.currentDataManager.data.viewTitle);
  };

  const prevHandle = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setDateRange(calendarApi.currentDataManager.data.viewTitle);
  };

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    setDateRange(calendarApi.currentDataManager.data.viewTitle);
  }, []);


  return (
    <div className="hms-calendar-toolbar mb-3">
      <div className="hms-calendar-toolbar-left space-x-6">
        <h3 className="fc-toolbar-title mr-3">{dateRange}</h3>
        <div className="flex space-x-4">
          <Button variant={'ghost'} size={'icon'} onClick={() => prevHandle()}>
            <Icons.chevronLeft className='text-cyan-700' />
          </Button>
          <Button variant={'ghost'} size={'icon'} onClick={() => nextHandle()}>
            <Icons.chevronRight className='text-cyan-700' />
          </Button>
        </div>
      </div>


    </div>
  )
}

export default HeaderScheduler