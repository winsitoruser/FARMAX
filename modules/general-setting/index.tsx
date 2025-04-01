import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ModuleCategory from "../category/module-category"
import ModuleProdType from "../prod-type"
import ModulePurchase from "../purchase/module-purchase"
import ModuleSalesUnit from "../sales-unit/module-sales-unit"

const forms = [
  {
    value: 'prod-type',
    label: 'Jenis Produk'
  },
  {
    value: 'sales-unit',
    label: 'Satuan Produk'
  },
  {
    value: 'purchase',
    label: 'Satuan Beli',
  },
  {
    value: 'category',
    label: 'Kategori'
  }
]

const ModuleGeneralSetting = () => {
  return (
    <Tabs defaultValue="prod-type">
      <TabsList className="grid w-full grid-cols-4">
        {forms.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="prod-type">
        <ModuleProdType />
      </TabsContent>
      <TabsContent value="sales-unit">
        <ModuleSalesUnit />
      </TabsContent>
      <TabsContent value="purchase">
        <ModulePurchase />
      </TabsContent>
      <TabsContent value="category">
        <ModuleCategory />
      </TabsContent>
    </Tabs>
  )
}

export default ModuleGeneralSetting