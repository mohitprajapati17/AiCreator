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

    const handleSave=()=>{};
    const handlePublish=()=>{};
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

    </div>
  )
}

export default PostEditor