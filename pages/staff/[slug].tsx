import Layout from "@/components/shared/layout"
import { BASE_URL } from "@/lib/constants"
import fetcher from "@/lib/fetcher"
import ModuleStaffId from "@/modules/staff/module-staff-id"
import { RetriveStaffDetail } from "@/types/staff"
import useSWR from "swr"
import { z } from "zod"

type Retrive = z.infer<typeof RetriveStaffDetail>

type Props = {
  data: Retrive
}

const StaffId: React.FC<Props> = ({ data }) => {
  const { data: fetchedData, error } = useSWR(`${BASE_URL}/staff/${data.id}`, fetcher);

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error fetching data</div>;
  }



  return (
    <Layout>
      {!fetchedData ? <div>Loading...</div> :
        <ModuleStaffId data={fetchedData} />
      }
    </Layout>
  )
}


export async function getServerSideProps(context: any) {
  const slug = context.params.slug;
  const data = await fetcher(`${BASE_URL}/staff/${slug}`);

  return {
    props: {
      data
    }
  };
}



export default StaffId