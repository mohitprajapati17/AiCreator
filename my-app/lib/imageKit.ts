// Upload file to ImageKit using your server-side API

import { any, boolean, json } from "zod";


interface resultInterface{
  success?: boolean,
        data?: {
            fileId: String,
            name: String,
            url: String,
            width: any,
            height: any,
            size: any
        }
        error?:any
}


export const uploadToImageKit=async(file:File,fileName:string)=>{
     try{
        const formData=new FormData;
        formData.append("file",file);
        formData.append("fileName",fileName);

        const response=await fetch("/api/imagekit/upload",
           { method:"POST",
            body:formData
           }
        )

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
        }

         const result = await response.json();
        

        const r:resultInterface|null={
            success: true,
            data: {
                fileId: result.fileId,
                name: result.name,
                url: result.url,
                width: result.width,
                height: result.height,
                size: result.size,
            },
        }
        return r;
     }
    catch (error:any) {
        console.error("ImageKit upload error:", error);
        const r:resultInterface|null={
        success: false,
        error: error.message,
        }
        return r;
    }
};