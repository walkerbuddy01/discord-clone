"use client";

import qs from "query-string";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/create-modal";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required ",
  }),
});

function MessageAttachment() {
  const { onClose, data, isOpen, type } = useModal();
  const { apiUrl, query } = data;
  const isModalOpen = isOpen && type === "messageAttachment";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({ url: apiUrl || "", query });

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log("Error in Server:", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="bg-white
      text-black  p-0 overflow-hidden
  "
      >
        <DialogHeader className="pt-4 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Upload Message Attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Attach photos and pdf with you message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center ">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-2">
              <Button disabled={isLoading} type="submit" variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MessageAttachment;
