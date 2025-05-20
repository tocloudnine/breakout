"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUpload } from "@/lib/context/upload-context";

export default function MetadataPage() {
  const router = useRouter();
  const { filePreview, metadata, updateMetadata } = useUpload();
  const [pricingType, setPricingType] = useState<"auction" | "fixed">("auction");
  const [editions, setEditions] = useState("1");

  if (typeof window !== 'undefined' && !filePreview) {
    router.push('/upload');
    return null;
  }

  const handleNext = () => {
    router.push("/review");
  };
  
  return (
    <section className="bg-black text-white max-w-md mx-auto flex flex-col h-full">
      <div className="flex-1 p-4">
        <h2 className="text-3xl font-light mb-3">MetaData</h2>
        <div className="flex justify-between mb-2">
          <div className="flex gap-1">
            <div className="w-2 h-1 bg-gray-500"></div>
            <div className="w-8 h-1 bg-white"></div>
            <div className="w-2 h-1 bg-gray-500"></div>
          </div>
          <div className="text-xs">STEP 2/3</div>
        </div>

        {filePreview && (
          <div className="mb-4">
            <Image
              src={filePreview}
              alt="Uploaded image"
              width={400}
              height={400}
              className="w-full aspect-square object-contain"
            />
          </div>
        )}

        {/* Required Fields */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-light">Required</h3>
            <div className="text-xs text-gray-400">01</div>
          </div>

          {/* Title Field */}
          <div className="flex mb-4">
            <div className="flex-1">
              <Input
                className="h-10 bg-[#1E1E1E] border-0 text-white focus-visible:ring-[hsla(251,63%,61%,1)]"
                placeholder="Title"
                value={metadata.title}
                onChange={(e) => updateMetadata({ title: e.target.value })}
              />
            </div>
            <Button variant="outline" className="h-10 bg-purple-card ml-2 px-3 text-sm border-0">
              {"<>"}
            </Button>
          </div>

          {/* Caption Field */}
          <div className="mb-4">
            <Textarea
              className="h-20 bg-[#1E1E1E] border-0 text-white focus-visible:ring-[hsla(251,63%,61%,1)] resize-none"
              placeholder="Caption"
              value={metadata.caption}
              onChange={(e) => updateMetadata({ caption: e.target.value })}
            />
          </div>

          {/* Price */}
          <div className="flex mb-4">
            <div className="flex-1">
              <Input
                className="h-10 bg-[#1E1E1E] border-0 text-white focus-visible:ring-[hsla(251,63%,61%,1)]"
                placeholder="Price"
                type="number"
                value={metadata.price}
                onChange={(e) => updateMetadata({ price: e.target.value })}
              />
            </div>
          </div>

          {/* Editions */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-1 block">Editions</label>
            <Select 
              value={metadata.edition.toString()} 
              onValueChange={(value) => updateMetadata({ edition: parseInt(value) })}
            >
              <SelectTrigger className="w-full bg-[#1E1E1E] border-0 text-white focus:ring-[hsla(251,63%,61%,1)]">
                <SelectValue placeholder="Select editions" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E1E] border-[#333] text-white">
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="9">9</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Footer with Next button */}
      <div className="p-4 ">
        <Button
          className="w-full bg-cyberdeus-purple-dark hover:bg-cyberdeus-purple h-12 rounded-md text-sm"
          onClick={handleNext}
        >
          NEXT <span className="ml-1">›</span>
        </Button>
      </div>
    </section>
  );
} 