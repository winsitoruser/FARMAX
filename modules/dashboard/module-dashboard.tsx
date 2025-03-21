import DashboardStat from '@/components/common/stat'
import { DataTableColumnHeader } from '@/components/table/column-header'
import DataTable from '@/components/table/data-table'
import { DataTableLoading } from '@/components/table/data-table-loading'
import { OpnameHalf } from '@/types/opname'
import { ColumnDef } from "@tanstack/react-table"
import { formatDate, formatRupiah } from '@/lib/formatter'

import CardOrder from '@/components/common/card-order'
import CardStaff from '@/components/common/card-staff'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useChartOrder from '@/hooks/use-chart-order'
import useOpname from '@/hooks/use-opname'
import useOrder from '@/hooks/use-order'
import useScheduler from '@/hooks/use-scheduler'
import { cn } from '@/lib/utils'
import { TypeAppoimentStaff } from '@/types/staff'
import Link from 'next/link'

import { useRouter } from 'next/navigation'
import type { ApexOptions } from 'apexcharts';
import ApexCharts from '@/components/ApexCharts'


interface ChartData {
  data: number[]
}

interface ChartSetting {
  series: ChartData[],
  options: ApexOptions
}

const ModuleDashboard = () => {
  const router = useRouter()
  const { order, isLoading } = useOrder();
  const { opnames, isLoading: loadingOpname } = useOpname();
  const { data: charts, isLoading: isLoadingChart } = useChartOrder();
  const { data } = useScheduler();


  const today = new Date();
  const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

  const dataToday = data.slice(0, 6).filter(item => {
    const itemStartTime = new Date(item.startTime);
    return itemStartTime >= startOfDay && itemStartTime <= endOfDay;
  });


  const ColumnDashboard: ColumnDef<OpnameHalf>[] = [
    {
      id: "id",
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tanggal" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{formatDate({ date: new Date(row.original.updatedAt) } || new Date())}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produk" />
      ),
      cell: ({ row }) => <div className='w-[160px]'>{row.getValue('product_name')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "qty",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Jumlah" className='text-center  ' />
      ),
      cell: ({ row }) => <div className='w-[60px]'>{row.getValue('qty')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <div className={cn('w-[80px] px-2 py-1 rounded text-center text-sm font-medium')} style={{ color: row.original.accept ? '#81C01C' : row.original.reject ? '#FF595E' : 'rgb(239, 143, 59)' }}>{row.original.accept ? 'Disetujui' : row.original.reject ? 'Ditolak' : 'Ditinjau'}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },

    {
      id: "actions",
      cell: ({ row }) => <Button size={'icon'} onClick={() => router.push(`stock-opname/${row.original.id}`)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
      </Button>,
    },
  ]

  const chartSettingBar: ChartSetting = {
    series: [{
      data: charts ? charts?.map(item => item.total) : [0]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ['#E05E46'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 7,
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: ['#E05E46'],
            fontSize: '12px',
            fontFamily: 'Inter',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
        }
      },
      xaxis: {
        categories: charts?.map(item => item.timeframe),
        labels: {
          show: true,
          style: {
            colors: ['#252525'],
            fontSize: '11px',
            fontFamily: 'Poppins',
            fontWeight: 500,
            cssClass: 'apexcharts-xaxis-label',
          },
          offsetY: -2,
        },
        axisBorder: {
          show: true,
          color: "#191919",
          offsetY: 10,
        },
        axisTicks: {
          show: false
        }
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w },) {
          let val = series[seriesIndex][dataPointIndex];
          return '<div class="hms-box-tooltip-chartbar-ver px-3 py-1">' +
            // `<img src="${iconChartBar.src}" class="mr-2" />` +
            `<span>${formatRupiah(val || 0)}</span>` +
            '</div>'

        }
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
      },
    },

  };


  return (
    <>
      <DashboardStat />
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        alignItems: "start",
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        <Card>
          <CardHeader className='mb-3' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardTitle className='text-slate-700 leading-relaxed'>Statistik Penjualan Apotek</CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoadingChart &&
              <ApexCharts
                options={chartSettingBar.options}
                series={chartSettingBar.series}
                type='bar'
                height={410} />
            }
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Card style={{ backgroundImage: "url('/bg-banner.png')", backgroundSize: 'cover' }}>
            <CardHeader className='mb-3'>
              <CardTitle className='text-2xl'>Point Of Sales</CardTitle>
              <CardDescription className='text-xl'>Tampilan Pembuatan Transaksi Kasir</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size={'lg'} onClick={() => router.push('/pos')}>Buat Transaksi</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='mb-3'>
              <div className="flex justify-between items-center">
                <CardTitle className='text-slate-700'>List Order Terakhir</CardTitle>
                <Link href="/stock-opname">
                  <span className='text-sm' style={{ color: '#5372E7' }}>Lihat Semua</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {!isLoading && order.length > 0 ? order?.slice(0, 3).map((order) => (
                <CardOrder key={order.id} order={order} />
              )) : <p className='text-center text-foreground'>Empty Data</p>}
            </CardContent>
          </Card>

        </div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        alignItems: "start",
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        <Card>
          <CardHeader className='mb-3'>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <CardTitle className='text-slate-700'>Stok Opname</CardTitle>
                <CardDescription>Hari ini</CardDescription>
              </div>
              <Link href={'/stock-opname'} className='text-sm' style={{ color: '#5372E7' }}>Lihat Semua</Link>
            </div>
          </CardHeader>
          <CardContent>
            {loadingOpname ? <DataTableLoading columnCount={5} /> :
              <DataTable columns={ColumnDashboard} data={opnames || []} withOutToolbar />
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='mb-3'>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <CardTitle className='text-slate-700'>List Petugas</CardTitle>
                <CardDescription>Hari ini</CardDescription>
              </div>
              <Link href={'/'} className='text-sm' style={{ color: '#5372E7' }}>Lihat Semua</Link>
            </div>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {dataToday.length >= 0 ? dataToday.map((item: TypeAppoimentStaff) => (
              <CardStaff key={item.id} data={item} />
            )) : <div className='text-xl text-slate-500 capitalize font-semibold text-center'>Tidak ada staff hari ini</div>}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ModuleDashboard