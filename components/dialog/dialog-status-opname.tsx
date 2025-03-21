import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useOpname from "@/hooks/use-opname";
import { FileWithPreview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Dropzone from "../common/dropzone";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

interface Props {
  id: string;
}

const schema = z.object({
  manager_name: z.string(),
  manager_sign: z.custom<File>((v) => v instanceof File, {
    message: 'Image is required',
  }),
});

type FormType = z.infer<typeof schema>;

const DialogStatusOpname: React.FC<Props> = ({ id }) => {
  const { putStatusAcceptOpname, putStatusRejectOpname } = useOpname();
  const [files, setFiles] = useState<FileWithPreview | undefined>();
  const [state, setState] = useState('')
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      manager_name: '',
      manager_sign: undefined,
    },
  });

  const handleAccept = async (data: FormType) => {
    const formData = new FormData();
    formData.append("manager_name", data.manager_name);
    formData.append("manager_sign", data.manager_sign);
    await putStatusAcceptOpname(id, formData);
    form.reset()
    setState('')
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    await putStatusRejectOpname(id);
    form.reset()
    setState('')
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" style={{ color: 'rgb(239, 143, 59)' }}>
          Menunggu Persetujuan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Status Opname</DialogTitle>
          <DialogDescription>
            Untuk ubah status jadi <strong>Terima</strong> wajibkan mengisi form
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={state === 'accepted' ? form.handleSubmit(handleAccept) : handleReject}>
            <div className="flex flex-col space-y-3">
              <FormField
                control={form.control}
                name="manager_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Manager</FormLabel>
                    <Input {...field} placeholder='Ex. ' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manager_sign"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TTD Manager</FormLabel>
                    <Dropzone
                      setValue={form.setValue}
                      files={files}
                      setFiles={setFiles}
                      maxSize={1024 * 1024 * 4}
                      name="manager_sign"
                    />
                  </FormItem>
                )}
              />
            </div>
            <DialogClose asChild>
              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  type="submit"
                  onClick={() => setState('rejected')}
                >
                  Tolak
                </Button>
                <Button size="sm" type="submit" onClick={() => setState('accepted')}>
                  Terima
                </Button>
              </div>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogStatusOpname;
