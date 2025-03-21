
import Link from "next/link"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserCircle } from "lucide-react"



export function UserAccountNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UserCircle className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{'user.name'}</p>

            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {'user.email'}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            // signOut({
            //   callbackUrl: `${window.location.origin}/login`,
            // })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}