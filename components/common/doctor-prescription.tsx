import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import usePrescription from "@/hooks/use-prescription"
import { Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import CardPatient from "./card-patient"


const DoctorPrescription = () => {
  const { data: { paid, unpaid }, isLoading, isError } = usePrescription()

  console.log(paid, unpaid)

  return (
    <div className="bg-white rounded-xl h-full p-6">
      <Tabs defaultValue="unpaid" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unpaid">Belum Tebus</TabsTrigger>
          <TabsTrigger value="paid">Sudah Tebus</TabsTrigger>
        </TabsList>
        <div className="relative" style={{ margin: '1.5rem 0 1rem 0' }}>
          <Button variant={'ghost'} size={'icon'} className="absolute top-0 left-0">
            <Search size={18} />
          </Button>
          <Input className="pl-8" />
        </div>
        <TabsContent value="unpaid">
          <div className="space-y-1">
            {unpaid?.map(item => (
              <CardPatient data={item} key={item.id} mode="unpaid" />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="paid">
          <div className="space-y-1">
            {paid?.map(item => (
              <CardPatient data={item} key={item.id} mode="paid" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}

export default DoctorPrescription