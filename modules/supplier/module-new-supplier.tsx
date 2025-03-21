import { Breadcrumbs } from '@/components/common/breadcrumbs'
import FormNewSupplier from '@/components/forms/form-new-supplier'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ModuleNewSupplier = () => {
  return (
    <div className='space-y-6'>
      <Breadcrumbs
        segments={[
          {
            title: 'Supplier',
            href: '/supplier'
          },
          {
            title: 'Buat Supplier',
            href: '/supplier/new'
          }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Su</CardTitle>
        </CardHeader>
        <CardContent>
          <FormNewSupplier />
        </CardContent>
      </Card>
    </div>
  )
}

export default ModuleNewSupplier