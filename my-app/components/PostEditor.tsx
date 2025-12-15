import React from 'react'
import { scheduler } from 'timers/promises'
import { z } from 'zod'
import { useConvexMutation } from "@/hooks/use-convex-query"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import PostEditorHeader from './post-editor-header'
import PostEditorContent from './PostEditorContent'
import PostEditorSettings from './PostEditorSettings'
import { useEffect } from 'react'
import ImageUploadModal from './ImageUploadModal'
import { toast } from 'sonner'

const postSchema= z.object({
    title:z.string().min(3,{message:"Title must be at least 3 characters long"}).max(100,{message:"Title must be at most 100 characters long"}),
    content:z.string().min(1,{message:"Content is required"}),
    category:z.string().optional(),
    tags:z.array(z.string()).max(10,"max 10 tags allowed"),
    featuredImage:z.string().optional(),
    scheduledFor:z.string().optional()
})
function PostEditor({initialData =null  ,mode="create"}:{initialData:any,mode:string}) {
    const [isSettingsOpen,setIsSettingsOpen]=useState(false)
    const [isImageModalOpen,setIsImageModalOpen]=useState(false)
    const [imageModalType,setImageModalType]=useState("featured")
    const [quillRef,setQuillRef]=useState<HTMLDivElement | null>(null)

    const {mutate:createPost,isLoading :isCreateLoading}=useConvexMutation(api.post.create)
    const {mutate:updatePost,isLoading :isUpdateLoading}=useConvexMutation(api.post.update)
    const router=useRouter()
    const form =useForm({
        resolver:zodResolver(postSchema),
        defaultValues:{
            title: initialData?.title || "",
            content: initialData?.content || "",
            category: initialData?.category || "",
            tags: initialData?.tags || [],
            featuredImage: initialData?.featuredImage || "",
            scheduledFor: initialData?.scheduledFor
                ? new Date(initialData.scheduledFor).toISOString().slice(0, 16)
                : "",
        }
    })

    const {handleSubmit ,watch ,setValue}=form;
    const watchedValues=watch();

    // Auto save  for drafts
    useEffect(()=>{

        if(!watchedValues.title||!watchedValues.content){
            return;
        }

        const autosave=setInterval(()=>{
            if(watchedValues.title||watchedValues.content){
                if(mode==="create") handleSave(true);
            }
        },30000)
        return ()=>clearInterval(autosave)
    },[watchedValues.title,watchedValues.content])

    const handleImageSelect=(imageData:any)=>{
        if(imageModalType==="featured"){
            setValue("featuredImage",imageData.url)
            toast.success("featured  image succesfully added")
        }
        else if(imageModalType ==="content"&&quillRef){
            // Get the Quill instance from the ref
            const quillInstance = (quillRef as any)?.getEditor?.();
            if (quillInstance) {
                const range = quillInstance.getSelection();
                const index = range ? range.index : quillInstance.getLength();
                
                quillInstance.insertEmbed(index, "image", imageData.url);
                quillInstance.setSelection(index + 1);
                toast.success("Image inserted!");
            }
        }
        setIsImageModalOpen(false)
    }

    // submit handler
    const  onSubmit =async (data :any , action :any , silent=false)=>{
        console.log(action , mode , initialData?._id)
        try{
            const postData={
                title:data.title,
                content:data.content,
                category:data.category||undefined,
                tags:data.tags,
                featuredImage:data.featuredImage||undefined,
                status:action==="publish"?"published":"draft",
                scheduledFor:data.scheduledFor?new Date(data.scheduledFor).getTime():undefined,
            }

            let resultId;
            

            if(mode==="edit"&&initialData?._id){
                // Always use update for edit mode
                resultId=await updatePost({
                    id:initialData._id,
                    ...postData
                })
            }
            else if(action==="draft"&&initialData?._id){
                
                // If we have existing draft data, update it
                resultId=await updatePost({
                    id: initialData._id,
                    ...postData,
                })
                toast.success("Draft updated")
            }
            else{
                // Create new post
                resultId=await createPost(postData)
            }

            if (!silent) {
                const message =
                action === "publish" ? "Post published!" : "Draft saved!";
                toast.success(message);
                if (action === "publish") router.push("/dashboard/posts");
            }

            return resultId;
            } 
             catch (error:any) {
                if (!silent) toast.error(error.message || "Failed to save post");
                
                throw error;

        }

    }


    const handleSave=(silent:boolean=false)=>{
        console.log("Saving post...")
        handleSubmit(async (data) => {
            await onSubmit(data, "draft", silent);
            if (!silent) {
                console.log("draft saved");
            }
        })();
    };
    const handlePublish=(silent:boolean=false)=>{
        console.log("Publishing post...")
        handleSubmit((data) => onSubmit(data, "publish"))();
    };
    const handleSchedule=()=>{};

  return (
    <div  className ="min-h-screen  bg-slate-900 text-white">
        {/* {Header} */}
        <PostEditorHeader
        mode={mode}
        initialData={initialData}
        isPublishing ={isCreateLoading ||isUpdateLoading}
        onSave={handleSave}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
        onSettingsOpen={()=>setIsSettingsOpen(true)}
        onBack={()=>router.push("/dashboard")}
        />
        {/* editor */}
        <PostEditorContent
         form={form}
         setQuillRef={setQuillRef}
         onImageUpload={(type:string)=>{
            setImageModalType(type);
            setIsImageModalOpen(true);
         }}
        />
        {/* settings dialog */}
        <PostEditorSettings
        isOpen={isSettingsOpen}
        onClose={()=>setIsSettingsOpen(false)}
        form={form}
        mode={mode}

        />

        {/* image upload  dialog */}
        <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={()=>setIsImageModalOpen(false)}
        
        onImageSelect={handleImageSelect}
        // title={imageModalType==="featured"?"upload Featured Image":"Insert Image"}
        />

    </div>
  )
}

export default PostEditor