
import * as React from "react";
import { Cross2Icon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { type Table, type ColumnFiltersState, } from "@tanstack/react-table";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { cn } from "@/lib/utils";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFilterableColumn, DataTableSearchableColumn } from "@/types";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
  data?: any[] | [],
  fileName?: string | undefined,
  newModal?: React.ReactNode
}


interface ExportButtonProps {
  tableInstance: any;
  fileName: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ tableInstance, fileName }) => {
  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.table_to_sheet(tableInstance?.table);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(blob, fileName + fileExtension);
  };

  return (
    <Button variant={'outline'} onClick={exportToExcel} className="h-8 text-xs">
      Export
    </Button>
  );
};


export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  deleteRowsAction, fileName, newModal
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPending, startTransition] = React.useTransition();


  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  key={String(column.id)}
                  placeholder={`Filter ${column.title}...`}
                  value={
                    (table
                      .getColumn(String(column.id))
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(String(column.id))
                      ?.setFilterValue(event.target.value)
                  }
                  className="h-8 w-[150px] lg:w-[250px]"
                />
              ),
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.title}
                  options={column.options}
                />
              ),
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3 text-sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {fileName && <ExportButton fileName={fileName || ''} tableInstance={{ table: document.querySelector('table') }} />}
        {newModal && newModal}
        {deleteRowsAction && table.getSelectedRowModel().rows.length > 0 ? (
          <Button
            aria-label="Delete selected rows"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={(event) => {
              startTransition(() => {
                table.toggleAllPageRowsSelected(false);
                deleteRowsAction(event);
              });
            }}
            disabled={isPending}
          >
            <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        ) : newRowLink ? (
          <Link aria-label="Create new row" href={newRowLink}>
            <div
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "h-8",
                }),
              )}
            >
              <PlusCircledIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              New
            </div>
          </Link>
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}