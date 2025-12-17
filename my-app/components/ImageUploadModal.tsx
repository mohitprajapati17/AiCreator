"use client"

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2, Check, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { uploadToImageKit } from "../lib/imageKit"
import { useCallback } from 'react'
import { Files } from '@google/genai'
import { ImageIcon } from 'lucide-react'


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

  const [activeTabs, setActiveTab]=useState("upload")
  const [uploadedImage, setUploadedImage]=useState<{url:string, width:string, height:string, size:string , fileId?:string , name?:string}|null>(null)
  const [isUploading , setIsUploading ]=useState(false)
  const  [isTransforming  , setIsTransforming]=useState(false);
  const  [transformedImage , setTransformedImage]=useState<string|null>(null);

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

// Handle file upload
  const onDrop = useCallback(async (acceptedFiles:File[])=>{
  const file =acceptedFiles[0];
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

  try{
    const fileName = `post-image-${Date.now()}-${file.name}`;
    const  result =await uploadToImageKit(file, fileName);

    if (result.success && result.data) {
        setUploadedImage({
          url: result.data.url.toString(),
          width: result.data.width.toString(),
          height: result.data.height.toString(),
          size: result.data.size.toString()
        });
        setTransformedImage(result.data.url.toString());
        setActiveTab("transform");
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, []);


  const {getRootProps , getInputProps , isDragActive}=useDropzone({
    onDrop,
    accept:{
      "image/*" :[".jpeg",".jpg",".png",".webp" ,".gif"],

    },
    multiple :false,


  })

  const watchedValues=watch();


  // Reset form
  const resetForm = () => {
    setUploadedImage(null);
    setTransformedImage(null);
    setActiveTab("upload");
    reset();
  };

  const handleSelectImage=()=>{
    if(transformedImage){
      onImageSelect({
        url:transformedImage,
        originalUrl:uploadedImage?.url,
        fileId: uploadedImage?.fileId,
        name: uploadedImage?.name,
        width: uploadedImage?.width,
        height: uploadedImage?.height,
      })
       onClose();
      resetForm();
    }
  }


    const handleClose=()=>{
      onClose();
      resetForm();
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


            {uploadedImage && (
              <div className="text-center space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-300 border-green-500/30"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Image uploaded successfully!
                </Badge>
                <div className="text-sm text-slate-400">
                  {uploadedImage.width} × {uploadedImage.height} •{" "}
                  {Math.round(parseInt(uploadedImage.size) / 1024)}KB
                </div>
                <Button
                  onClick={() => setActiveTab("transform")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Start Transforming
                </Button>
              </div>
            )}
      
      </TabsContent>
    <TabsContent value="Transform" className ="space-y-6">
      <div className ="grid lg:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
        <div className ="space-y-6"> 
          </div>

          {/* {image preview } */}
          <div className ="space-y-4">
            <h3 className ="text-lg font-semibold text-white flex items-center ">
                 <ImageIcon className="h-5 w-5 mr-2" />
                  Preview
            </h3>

            {transformedImage&&(
              <div className ="relative">
                <div className ="bg-slate-800/50 rounded-lg p-4 border border-slate-700"> 
                   <img src={transformedImage} alt="Tranformed preview" 
                   className="w-full h-auto max-h-96 object-contain rounded-lg mx-auto"
                   onError={() => {
                          toast.error("Failed to load transformed image");
                          setTransformedImage(uploadedImage?.url ?? null);
                        }}/>
                   
                   </div>

                   {isTransforming&&(
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="bg-slate-800 rounded-lg p-4 flex items-center space-x-3">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                          <span className="text-white">
                            Applying transformations...
                          </span>
                      </div>
                    </div>
                   )}
              </div>
            )}

            {uploadedImage&&transformedImage&&(
              <div className ="text-center space-y-4">
                <div className ="text-sm  text-slate-400">
                  Current image URL ready for use
                </div>
                <div className ="flex gap-3 justify-center">
                  <Button
                  onClick ={handleSelectImage}
                  className ="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                        Use This Image

                  </Button>

                  <Button
                        onClick={handleClose}
                        variant="outline"
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        Cancel
                      </Button>
                  </div>

              </div>
            )}
          </div>
        
         
      </div>
      </TabsContent>
  </Tabs>
  </DialogContent>
</Dialog>
  )
}

export default ImageUploadModal