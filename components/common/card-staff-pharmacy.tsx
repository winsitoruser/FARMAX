import Image from 'next/image';
import Link from "next/link";

type PropsTypes = {
  id: string, first_name: string, last_name: string, role: string, image_id: string,
}
const CardStaffPharmacy: React.FC<PropsTypes> = ({ id, first_name, last_name, role, image_id, }) => {

  return (
    <div className="flex w-full w-min-[350px]">
      <Image src={image_id} alt={`${first_name}-${id}`} className="rounded-s-xl h-44 w-72" height={199} width={180}
        quality={100}
        style={{
          height: '199px',
          width: '180px',
          objectFit: 'cover',
        }} priority />
      <div className="p-6 flex items-center rounded-e-xl w-min-[350px] w-full bg-white relative">
        <div className="space-y-1 capitalize">
          <p className="font-medium">{first_name} {last_name}</p>
          <p className="text-muted-foreground text-sm">{role}</p>
        </div>
        <div className="absolute right-10 bottom-6">
          <Link href={`/staff/${id}`} prefetch={false} className="text-sm text-blue-500">Lihat Detail</Link>
        </div>
      </div>
    </div>
  )
}

export default CardStaffPharmacy