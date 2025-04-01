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

export interface ItemSidebar {
  title: string;
  path?: string;
  icon: string;
  dropdown?: ItemSidebar[];
  subdropdown?: ItemSidebar[];
}

interface PropsSidebarItem {
  item: ItemSidebar;
}

const ItemSidebarKomponen: React.FC<PropsSidebarItem> = ({ item }) => {
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
      {item.dropdown ? (
        <>
          <div
            onClick={toggleDropdown}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex justify-start w-full relative cursor-pointer select-none text-[#343434] hover:bg-primary hover:text-white hover:frm-menu"
            )}
          >
            <div className="mr-2 h-4 w-4">
              <ReactSVG src={item.icon} />
            </div>
            <span className={cn("flex-1 text-left", !isOpen && "hidden")}>
              {item.title}
            </span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isDropdownOpen && "rotate-90",
                !isOpen && "hidden"
              )}
            />
          </div>
          {isDropdownOpen && (
            <div className={cn("ml-4 pl-2 border-l-2 border-gray-200", !isOpen && "hidden")}>
              {item.dropdown.map((subItem, index) => (
                <div key={index}>
                  {subItem.subdropdown ? (
                    <>
                      <div
                        onClick={toggleSubDropdown}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "flex justify-start w-full cursor-pointer select-none text-[#343434] hover:bg-primary hover:text-white hover:frm-menu"
                        )}
                      >
                        <div className="mr-2 h-4 w-4">
                          <ReactSVG src={subItem.icon} />
                        </div>
                        <span className="flex-1 text-left">{subItem.title}</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isSubDropdownOpen && "rotate-90"
                          )}
                        />
                      </div>
                      {isSubDropdownOpen && (
                        <div className="ml-4 pl-2 border-l-2 border-gray-200">
                          {subItem.subdropdown.map((subSubItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subSubItem.path || "#"}
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "flex justify-start w-full text-[#343434] hover:bg-primary hover:text-white hover:frm-menu",
                                pathname === subSubItem.path && "bg-primary text-white frm-menu"
                              )}
                            >
                              <div className="mr-2 h-4 w-4">
                                <ReactSVG src={subSubItem.icon} />
                              </div>
                              <span className="flex-1 text-left">{subSubItem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={subItem.path || "#"}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "flex justify-start w-full text-[#343434] hover:bg-primary hover:text-white hover:frm-menu",
                        pathname === subItem.path && "bg-primary text-white frm-menu"
                      )}
                    >
                      <div className="mr-2 h-4 w-4">
                        <ReactSVG src={subItem.icon} />
                      </div>
                      <span className="flex-1 text-left">{subItem.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path || "#"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex justify-start w-full text-[#343434] hover:bg-primary hover:text-white hover:frm-menu",
            pathname === item.path && "bg-primary text-white frm-menu"
          )}
        >
          <div className="mr-2 h-4 w-4">
            <ReactSVG src={item.icon} />
          </div>
          <span className={cn("flex-1 text-left", !isOpen && "hidden")}>
            {item.title}
          </span>
        </Link>
      )}
    </>
  );
};

export default ItemSidebarKomponen;
