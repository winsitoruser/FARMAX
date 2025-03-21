import { Breadcrumbs } from "@/components/common/breadcrumbs";
import FormNewDrugs from "@/components/forms/form-new-drugs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ModuleNewDrugsData = () => {

  return (
    <div className="space-y-6">
      <Breadcrumbs segments={[
        {
          href: '/drugs-data',
          title: 'Data Obat'
        },
        {
          href: '/drugs-data/new',
          title: 'Listing Produk'
        }
      ]} />
      <Card>
        <CardHeader>
          <CardTitle>Listing Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <FormNewDrugs />
        </CardContent>
      </Card>
    </div>
  )
}

export default ModuleNewDrugsData