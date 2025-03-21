import { cn, formatBytes } from "@/lib/utils";
import { FileWithPreview } from "@/types";
import Image from "next/image";
import React from 'react';
import {
  useDropzone,
  type Accept,
  type FileRejection,
  type FileWithPath,
} from "react-dropzone";
import type {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { toastAlert } from '@/components/common/alerts'
import { Button } from '../ui/button';
import { Icons } from './Icons';


interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.HTMLAttributes<HTMLDivElement> {
  name: TName;
  setValue: UseFormSetValue<TFieldValues>;
  accept?: Accept;
  maxSize?: number;
  maxFiles?: number;
  files?: FileWithPreview;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview | undefined>>;
  isUploading?: boolean;
  disabled?: boolean;
}

export default function Dropzone<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  maxSize = 1024 * 1024 * 2,
  files,
  setFiles,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: Props<TFieldValues>) {

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setFiles(fileWithPreview);
      });

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toastAlert(`File is too large. Max size is ${formatBytes(maxSize)}`, 'error')

            return;
          }
          errors[0]?.message && toastAlert(`${errors[0].message}`, 'error');
        });
      }
    },

    [maxSize, setFiles],
  );

  // Register files to react-hook-form
  React.useEffect(() => {
    setValue(name, files as PathValue<TFieldValues, Path<TFieldValues>>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    multiple: false,
    disabled,
  });

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      URL.revokeObjectURL(files.preview);
    };
  }, [files]);

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "group relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragActive && "border-muted-foreground/50",
          disabled && "pointer-events-none opacity-60",
          className,
        )}
        {...props}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="group grid w-full place-items-center gap-1 sm:px-10">

            <Icons.upload
              className="h-9 w-9 animate-pulse text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        ) : isDragActive ? (
          <div className="grid place-items-center gap-2 text-muted-foreground sm:px-5">
            <Icons.upload
              className={cn("h-8 w-8", isDragActive && "animate-bounce")}
              aria-hidden="true"
            />
            <p className="text-base font-medium">Drop the file here</p>
          </div>
        ) : (
          <div className="grid place-items-center gap-1 sm:px-5">
            <Icons.upload
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-2 text-base font-medium text-muted-foreground">
              Drag {`'n'`} drop file here, or click to select file
            </p>
            <p className="text-sm text-slate-500">
              Please upload file with size less than {formatBytes(maxSize)}
            </p>
          </div>
        )}
      </div>
      {/* <p className="text-center text-sm font-medium text-muted-foreground">
          You can upload up to {maxFiles} {maxFiles === 1 ? "file" : "files"}
        </p> */}
      {files ? (
        <div className="grid gap-5 mt-4">
          <FileCard file={files} />
        </div>
      ) : null}
      {files ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2.5 w-full"
          onClick={() => setFiles(undefined)}
        >
          <Icons.trash className="mr-2 h-4 w-4" aria-hidden="true" />
          Remove All
          <span className="sr-only">Remove all</span>
        </Button>
      ) : null}
    </div>
  )
}



interface FileCardProps {
  file: FileWithPreview;
}

function FileCard({ file }: FileCardProps) {



  return (
    <div className="relative flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <Image
          src={file.preview}
          alt={file.name}
          className="h-10 w-10 shrink-0 rounded-md"
          width={40}
          height={40}
          loading="lazy"
        />
        <div className="flex flex-col">
          <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
            {file.name}
          </p>
          <p className="text-xs text-slate-500">
            {(file.size / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      </div>
    </div>
  );
}