"use client"

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const transformationSchema = z.object({
  aspectRatio: z.string().default("original"),
  customWidth: z.number().min(100).max(2000).default(800),
  customHeight: z.number().min(100).max(2000).default(600),
  smartCropFocus: z.string().default("auto"),
  textOverlay: z.string().optional(),
  textFontSize: z.number().min(12).max(200).default(50),
  textColor: z.string().default("#ffffff"),
  textPosition: z.string().default("center"),
  backgroundRemoved: z.boolean().default(false),
  dropShadow: z.boolean().default(false),
});

const ASPECT_RATIOS = [
  { label: "Original", value: "original" },
  { label: "Square (1:1)", value: "1:1", width: 400, height: 400 },
  { label: "Landscape (16:9)", value: "16:9", width: 800, height: 450 },
  { label: "Portrait (4:5)", value: "4:5", width: 400, height: 500 },
  { label: "Story (9:16)", value: "9:16", width: 450, height: 800 },
  { label: "Custom", value: "custom" },
];

const SMART_CROP_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "Face", value: "face" },
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
];

const TEXT_POSITIONS = [
  { label: "Center", value: "center" },
  { label: "Top Left", value: "north_west" },
  { label: "Top Right", value: "north_east" },
  { label: "Bottom Left", value: "south_west" },
  { label: "Bottom Right", value: "south_east" },
  { label: "top", value: "north" },
  { label: "bottom", value: "south" },
  { label: "left", value: "west" },
  { label: "right", value: "east" },
];

function ImageUploadModal( {isOpen , onClose ,  onImageSelect , title}:{isOpen:boolean , onClose:()=>void , onImageSelect:(imageData:any)=>void , title:string}) {

  const [activeTabs, setActiveTabs]=useState("upload")
  const [uploadedImage, setUploadedImage]=useState<string | null>(null)
  const [isUploading , setIsUploading ]=useState(false)
  const  [isTransforming  , setIsTransforming]=useState(false);
  const  [transformedImage , setIsTransformedImage]=useState(false);

   const form = useForm({
    resolver: zodResolver(transformationSchema),
    defaultValues: {
      aspectRatio: "original",
      customWidth: 800,
      customHeight: 600,
      smartCropFocus: "auto",
      textOverlay: "",
      textFontSize: 50,
      textColor: "#ffffff",
      textPosition: "center",
      backgroundRemoved: false,
      dropShadow: false,
    },
  });

  const {watch ,reset ,setValue}=form;
const onDrop =async(accetedFiles:File[])=>{
  const file =accetedFiles[0];
  if(!file) return

  if(!file.type.startsWith("image/")){
    toast.error("Please upload an image file")
    return;
  }
  if(file.size>10*1024*1024){
    toast.error("File size should be less than 10mb")
    return;
  }
  setIsUploading(true);
}
  const {getRootProps , getInputProps , isDragActive}=useDropzone({
    onDrop,
    accept:{
      "image/*" :[".jpeg",".jpg",".png",".webp" ,".gif"],

    },
    multiple :false,


  })

  const watchedValues=watch();

    const handleClose=()=>{
      onClose();
    }


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent className ="!max-w-6xl !h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
    <Tabs defaultValue="account" className="w-full">
    <TabsList className ="w-full  grid grid-cols-2">
      <TabsTrigger value="Upload">upload</TabsTrigger>
      <TabsTrigger value="Transform" disabled={!uploadedImage}>transform</TabsTrigger>
    </TabsList>
    <TabsContent value="Upload" className ="space-y-4">
      <div {...getRootProps()} className ="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors">
         <input {...getInputProps()}/>

        {isUploading?(
          <div className ="space-y-4">
            <Loader2 className ="h-12 w-12 mx-auto  text-slate-400 animated-spin text-purple-400"/>
            <p className ="text-slate-300"> Uploading Image...</p>
          </div>
        ):(
           <div className ="space-y-4">
            <Upload className ="h-12 w-12 mx-auto  text-slate-400"/>
            <div>
              <p className ="text-lg text-white">
                {isDragActive ? "Drop the image here" :"Drag and drop your image here or click to upload"}

              </p>
              <p className ="text-sm text-slate-400 mt-2">
                or Click to  send a file (JPG , PNG, WebP ,GIF -Max 10mb)

              </p>
            </div>

         </div>
        )}
      </div>
      
      </TabsContent>
    <TabsContent value="Transform" className ="space-y-6">
      transform
      </TabsContent>
  </Tabs>
  </DialogContent>
</Dialog>
  )
}

export default ImageUploadModal