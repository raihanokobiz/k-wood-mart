"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontal, Upload as LucideUpload } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TCategory, TContact, TCoupon } from "@/types/shared";
import { confirmation } from "@/components/modals/confirm-modal";

import { BASE_URL } from "@/config/config";
import { Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fileUrlGenerator, makeFormData } from "@/utils/helpers";
import Image from "next/image";
import { deleteAction } from "./actions";

interface Props {
  item: TContact
}

export const DetailsSheet2: React.FC<Props> = ({ item }) => {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [imageFileList, setImageFileList] = React.useState<UploadFile<any>[]>([
    // {
    //   uid: "-1",
    //   name: String(item.image).split("/").pop() || "",
    //   status: "done",
    //   url: fileUrlGenerator(item.image || ""),
    // },
  ]);
  const [vectorFileList, setVectorFileList] = React.useState<UploadFile<any>[]>(
    [
    //   {
    //     uid: "-1",
    //     name: String(item.vectorImage).split("/").pop() || "",
    //     status: "done",
    //     url: fileUrlGenerator(item.vectorImage || ""),
    //   },
    ]
  );

//   const [selectedImageUrl, setSelectedImageUrl] = React.useState(
//     fileUrlGenerator(item.image)
//   );
//   const [selectedVectorImageUrl, setSelectedVectorImageUrl] = React.useState(
//     item.vectorImage ? fileUrlGenerator(item.vectorImage) : ""
//   );

  //   const form = useForm<z.infer<typeof formSchema>>({
  //     resolver: zodResolver(formSchema),
  //     defaultValues: {
  //       name: item.name,
  //       image: [],
  //       vectorImage: [],
  //     },
  //   });

  // React.useEffect(() => {
  //   form.reset({
  //     name: item.name,
  //     image: [],
  //     vectorImage: [],
  //   });

  //   setSelectedImageUrl(item.image);
  //   setSelectedVectorImageUrl(item.vectorImage ? BASE_URL + item.vectorImage : "");

  //   setImageFileList([]);
  //   setVectorFileList([]);
  // }, [item, form]);

  //   const handleUploadChange =
  //     (
  //       fileListSetter: React.Dispatch<any>,
  //       formFieldName: "image" | "vectorImage",
  //       urlSetter: React.Dispatch<React.SetStateAction<string>>,
  //       form: any
  //     ) =>
  //     ({ fileList }: any) => {
  //       const newList = fileList.slice(-1);
  //       fileListSetter(newList);

  //       const rawFiles = newList.map((f: any) => f.originFileObj).filter(Boolean);
  //       if (rawFiles.length > 0) {
  //         form.setValue(formFieldName, rawFiles);
  //         urlSetter(URL.createObjectURL(rawFiles[0]));
  //       } else {
  //         form.setValue(formFieldName, []);
  //         urlSetter("");
  //       }
  //     };

  //   const handleRemoveFile =
  //     (
  //       fileListSetter: React.Dispatch<any>,
  //       formFieldName: "image" | "vectorImage",
  //       urlSetter: React.Dispatch<React.SetStateAction<string>>,
  //       form: any
  //     ) =>
  //     () => {
  //       fileListSetter([]);
  //       form.setValue(formFieldName, []);
  //       urlSetter("");
  //     };

  //   const onSubmitUpdate = async (values: z.infer<typeof formSchema>) => {
  //     setUpdating(true);
  //     console.log("values==========", values);
  //     const data = await makeFormData(values);
  //     try {
  //       await updateFormAction(String(item._id), data);
  //       toast({
  //         title: "Coupon updated successfully",
  //       });
  //       setSheetOpen(false);
  //     } catch (error: any) {
  //       toast({
  //         title: "Failed to update item",
  //         description: error.message,
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setUpdating(false);
  //     }
  //   };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this item?")) {
      setDeleting(true);
      const deleted = await deleteAction(String(item._id));
      if (deleted) {
        toast({
          title: "Coupon deleted successfully",
        });
        setSheetOpen(false);
      }
    }
    setDeleting(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:max-w-[750px] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Contact Details</SheetTitle>
        </SheetHeader>

        <Button
          type="button"
          variant="destructive"
          onClick={handleDeleteClick}
          loading={deleting}
        >
          Delete
        </Button>
      </SheetContent>
    </Sheet>
  );
};
