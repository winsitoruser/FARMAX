import { Shell } from '../common/shell-variant'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const DrugsDataLoading = () => {
  return (
    <Shell>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 2.5fr",
          alignItems: "start",
        }}
      >
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <Skeleton className='h-6 bg-slate-400' />
              <Skeleton className='h-6 bg-slate-400' />

            </CardHeader>
            <CardContent className='flex flex-col gap-4'>

              <Skeleton className='h-6 bg-slate-400' />
              <div className='grid grid-cols-2 gap-4'>
                <Skeleton className='h-6 bg-slate-400' />
                <Skeleton className='h-6 bg-slate-400' />
                <Skeleton className='h-6 bg-slate-400' />
                <Skeleton className='h-6 bg-slate-400' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div className="flex flex-col gap-3" key={i}>
                    <Skeleton className='h-3 bg-slate-400' />
                    <Skeleton className='h-6 bg-slate-400' />
                  </div>
                ))}

              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6 flex justify-between'>
              <Skeleton className='h-6 bg-slate-400 w-1/6' />
              <Skeleton className='h-6 bg-slate-400 w-1/6' />
            </CardContent>
          </Card>
        </div>
        <div className="w-full flex flex-col gap-4 h-full">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton className='h-8 bg-slate-400' key={i} />
            ))}
          </div>
          <Card className='h-full'>
            <CardContent className='pt-6'>
              <Skeleton className='h-6 bg-slate-400 w-1/4' />
              <div className="flex flex-col gap-4 mt-4">
                <Skeleton className='h-6 bg-slate-400' />
                <Skeleton className='h-6 bg-slate-400' />
                <Skeleton className='h-6 bg-slate-400' />
              </div>
            </CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardContent key={i}>
                  <Skeleton className='h-6 bg-slate-400 w-1/4' />
                  <div className="flex flex-col gap-4 mt-4">
                    <Skeleton className='h-6 bg-slate-400' />
                    <Skeleton className='h-6 bg-slate-400' />
                    <Skeleton className='h-6 bg-slate-400' />
                  </div>

                </CardContent>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  )
}

export default DrugsDataLoading