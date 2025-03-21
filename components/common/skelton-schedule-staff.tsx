import { Skeleton } from '../ui/skeleton'

const SkeltonScheduleStaff = () => {
  return (
    <div className="flex space-x-2 items-center">
      <Skeleton className="h-6 w-6 bg-slate-400" />
      <div className="flex items-center space-x-3 w-full">
        <Skeleton className="h-12 w-12 bg-slate-400 rounded-full" />
        <div className="flex flex-col space-y-2 w-[90%]">
          <Skeleton className="h-6 bg-slate-400" />
          <Skeleton className="h-6 bg-slate-400" />
        </div>
      </div>
    </div>
  )
}

export default SkeltonScheduleStaff