import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: any) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className=" relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="upload"
          className="rounded-full"
          quality={70}
          loading="eager"
        />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 bg-rose-600 rounded-full p-1 text-white shadow-sm"
          type="button"
        >
          <X className="h-4 w-4 " />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        // Do something with the response

        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
      className=" rounded-2xl text-white "
    />
  );
}

export default FileUpload;
