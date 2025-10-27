"use client";

import { Button } from "@/components/ui/button";
import { FileWarningIcon, TreesIcon } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error);
  }, [error]);

  return (
    <div className="h-[600px] flex justify-center items-center">
      <div className="w-[700px] flex flex-col items-center justify-center">
        <FileWarningIcon size={68} />
        <h1 className="">{error.name}</h1>
        <span className="italic text-slate-700">{error.message}</span>
        <h2>Something went wrong!</h2>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
