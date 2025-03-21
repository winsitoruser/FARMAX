import { buttonVariants } from "@/components/ui/button";
import useSidebar from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { log } from "console";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { ReactSVG } from "react-svg";

interface SidebarItemProps {
  title: string;
  path?: string;
  icon: string;
  dropdown?: SidebarItemProps[];
  subdropdown?: SidebarItemProps[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ title, path, icon: icon, dropdown }) => {
  const { isOpen } = useSidebar();
  const { pathname } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsDropdownOpen(false);
      setIsSubDropdownOpen(false);
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const toggleSubDropdown = () => {
    setIsSubDropdownOpen((prevState) => !prevState);
  };

  return (
    <>
      {dropdown ? (
        <>
          <div
            onClick={toggleDropdown}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex justify-start w-full relative cursor-pointer select-none text-[#343434] hover:bg-primary hover:text-white hover:frm-menu"
            )}
          >
            <div className="flex items-center">
              {/* <Icon className="h-4 w-4" /> */}
              <ReactSVG src={`${icon}`} />
              <span className={cn("ml-3 font-['Poppins'] text-[12px]", !isOpen && "hidden")}>{title}</span>
            </div>
            <div className={cn("absolute right-3", isDropdownOpen && "rotate-[90deg]")}>
              {isOpen && <ReactSVG src={"/icons/eva_arrow-down-fill.svg"} className={cn("", !isOpen && 'hidden')} />}
            </div>
          </div>

          {isDropdownOpen && (
            <div className={cn("pl-6 space-y-1", isDropdownOpen && 'animate-out ease-out')}>
              {dropdown.map((item, index) => (
                item.subdropdown ?
                  <>
                    <div
                      onClick={toggleSubDropdown}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "flex justify-start w-full relative cursor-pointer select-none text-[#343434] hover:bg-primary hover:text-white hover:frm-menu"
                      )}
                    >
                      <div className="flex items-center">
                        {/* <Icon className="h-4 w-4" /> */}
                        <ReactSVG src={`${item.icon}`} />
                        <span className={cn("ml-3 font-['Poppins'] text-[12px]", !isOpen && "hidden")}>{item.title}</span>
                      </div>
                      <div className={cn("absolute right-3", isSubDropdownOpen && "rotate-[90deg]")}>
                        {isOpen && <ReactSVG src={"/icons/eva_arrow-down-fill.svg"} className={cn("", !isOpen && 'hidden')} />}
                      </div>
                    </div>

                    {isSubDropdownOpen && (
                      <div className={cn("pl-6 space-y-1", isSubDropdownOpen && 'animate-out ease-out')}>
                        {item.subdropdown ? item.subdropdown.map((item, index) => (
                          <Link
                            key={index}
                            prefetch={false}
                            href={item.path || ''}
                            className={cn(
                              buttonVariants({ variant: "ghost" }),
                              "flex justify-start w-full relative text-[#343434] hover:bg-primary hover:text-white hover:frm-menu rounded-md",
                              pathname === item.path && 'bg-primary hover:bg-primary text-white frm-menu'
                            )}
                          >
                            {/* <item.icon className="h-4 w-4" /> */}
                            <ReactSVG src={`${item.icon}`} />
                            <span className={cn("ml-3 font-['Poppins'] text-[12px]", !isOpen && "hidden")}>{item.title}</span>
                          </Link>
                        )) : ""}
                      </div>
                    )}
                  </>
                  : (
                    <Link
                      key={index}
                      prefetch={false}
                      href={item.path || ''}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "flex justify-start w-full relative text-[#343434] hover:bg-primary hover:text-white hover:frm-menu rounded-md",
                        pathname === item.path && 'bg-primary hover:bg-primary text-white frm-menu'
                      )}
                    >
                      {/* <item.icon className="h-4 w-4" /> */}
                      <ReactSVG src={`${item.icon}`} />
                      <span className={cn("ml-3 font-['Poppins'] text-[12px]", !isOpen && "hidden")}>{item.title}</span>
                    </Link>
                  )
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          key={path}
          prefetch={false}
          href={path || ''}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex justify-start w-full relative text-[#343434] hover:bg-primary hover:text-white hover:frm-menu",
            pathname === path && "bg-primary hover:bg-primary text-white frm-menu"
          )}
        >
          {/* <Icon className="h-4 w-4" /> */}
          <ReactSVG src={`${icon}`} />
          <span className={cn("ml-3 font-['Poppins'] text-[12px]", !isOpen && "hidden")}>{title}</span>
        </Link>
      )}
    </>
  );
};

export default SidebarItem;
