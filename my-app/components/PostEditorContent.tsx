"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Sparkles, Wand2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { BarLoader } from "react-spinners";
import { minLength } from "zod";
import { generateBlogContent, improveContent } from "@/app/actions/gemini";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QuillWrapper = React.forwardRef<any, any>((props, ref) => {
  return <ReactQuill {...props} // @ts-ignore
  ref={ref} />;
});

if (typeof window !== "undefined") {
  import("quill/dist/quill.snow.css");
}

const quillConfig = {
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["image", "video"],
      ],
      handlers: { image: function () {} },
    },
  },
  formats: [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "link",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "image",
    "video",
  ],
};

function PostEditorContent({form,setQuillRef,onImageUpload}:any) {
  const getQuillModules = () => ({
    ...quillConfig.modules,
    toolbar: {
      ...quillConfig.modules.toolbar,
      handlers: { image: () => onImageUpload("content") },
    },
  });

  const [isGenerating , setIsGenerating]=useState(false);
  const [isImproving , setIsImproving]=useState(false);

  const {register , watch , setValue,formState:{errors}}=form;

  const watchValues=watch();

  const hasTitle=watchValues.title?.trim();
  const hasContent =watchValues.content&&watchValues.content!=="<p><br></p>"

  const handleAI=async(type:string,  improvementType:string|null)=>{
        const {title,content , category,tags} =watchValues;

        if(type=="generate"){
          if(!title.trim()){
            return toast.error("please add a title before adding a content");
          }

          if(content&&content!="<p><br></p>"&&window.confirm("this will remove your  entire content")){
            return;
            
          }

          setIsGenerating(true);

        }
        else{
          if(!content||content==="<p><br></p>"){
            return toast.error("please add some content before improving it");
            
          }
          setIsImproving(true);
        }

        try{
          const result =type==="generate"?
          await generateBlogContent(title,category,tags||[]):
          await improveContent(content,improvementType);

          if(result.success){
            setValue("content",result.content);

            toast.success(`Content ${type === "generate" ? "generated" : improvementType + "d"} successfully!`);

          }
          else{
            toast.error(result.error);
          }
        }
        catch(error:any){
          toast.error(`Failed to ${type} content. Please try again.`);

        }
        finally {
        type === "generate" ? setIsGenerating(false) : setIsImproving(false);
    }


  }

  return (
    <>
    <main className ="max-w-7xl mx-auto px-6 py-8">
        <div className ="space-y-6">
            {/* {featured  image} */}

                {watchValues.featuredImage ? (
                <div className="relative group">
                  <img
                    src={watchValues.featuredImage}
                    alt="Featured"
                    className="w-full h-80 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-3">
                    <Button
                      onClick={() => onImageUpload("featured")}
                      variant="secondary"
                      size="sm"
                    >
                      Change Image
                    </Button>
                    <Button
                      onClick={() => setValue("featuredImage", "")}
                      variant="destructive"
                      size="sm"
                    >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                <button
                  onClick={() => onImageUpload("featured")}
                  className="w-full h-36 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center space-y-4 hover:border-slate-500 transition-colors group"
                >
                  <ImageIcon className="h-12 w-12 text-slate-400 group-hover:text-slate-300" />
                  <div className="text-center">
                    <p className="text-slate-300 text-lg font-medium">
                      Add a featured image
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Upload and transform with AI
                    </p>
                  </div>
                </button>
          )}


            {/* title */}

                <div>
                <Input
                  {...register("title")}
                  placeholder="Post title..."
                  className="border-0 text-4xl font-bold bg-transparent placeholder:text-slate-500 text-white p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{ fontSize: "2.5rem", lineHeight: "1.2" }}
                />
                {errors.title && (
                  <p className="text-red-400 mt-2">{errors.title.message}</p>
                )}
               </div>


               {/* Ai tools  */}
                <div>
            {!hasContent ? (
              <Button
                onClick={() => handleAI("generate",null)}
                disabled={!hasTitle || isGenerating || isImproving}
                variant="outline"
                size="sm"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white disabled:opacity-50 w-full"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Content with AI
              </Button>
            ) : (
              <div className="grid grid-cols-3 w-full gap-2">
                {[
                  { type: "enhance", icon: Sparkles, color: "green" },
                  { type: "expand", icon: Plus, color: "blue" },
                  { type: "simplify", icon: Minus, color: "orange" },
                ].map(({ type, icon: Icon, color }) => (
                  <Button
                    key={type}
                    onClick={() => handleAI("improve", type)}
                    disabled={isGenerating || isImproving}
                    variant="outline"
                    size="sm"
                    className={`border-${color}-500 text-${color}-400 hover:bg-${color}-500 hover:text-white disabled:opacity-50`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    AI {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            )}
            {!hasTitle && (
              <p className="text-xs text-slate-400 w-full pt-2">
                Add a title to enable AI content generation
              </p>
            )}
          </div>

          {(isGenerating || isImproving) && (
            <BarLoader width={"95%"} color="#D8B4FE" />
          )}
            {/* editor */}
            <div>

                <QuillWrapper
                ref={setQuillRef}
                theme="snow"
                modules={getQuillModules()}
                value={watchValues.content}
                onChange={(content:string) => setValue("content", content)}
                formats={quillConfig.formats}
                style={{minHeight:"100px",fontSize:"1.125rem",lineHeight:"1.7"}}
                placeholder="Write something awesome..."
                />
                {errors.content && (
              <p className="text-red-400 mt-2">{errors.content.message}</p>
            )}
            </div>
            <style jsx global>{`
        .ql-editor {
          color: white !important;
          font-size: 1.125rem !important;
          line-height: 1.7 !important;
          padding: 0 !important;
          min-height: 400px !important;
        }
        .ql-editor::before {
          color: rgb(100, 116, 139) !important;
        }
        .ql-toolbar {
          border: none !important;
          padding: 0 0 1rem 0 !important;
          position: sticky !important;
          top: 80px !important;
          background: rgb(15, 23, 42) !important;
          z-index: 30 !important;
          border-radius: 8px !important;
          margin-bottom: 1rem !important;
        }
        .ql-container {
          border: none !important;
        }
        .ql-snow .ql-tooltip {
          background: rgb(30, 41, 59) !important;
          border: 1px solid rgb(71, 85, 105) !important;
          color: white !important;
        }
        .ql-snow .ql-picker {
          color: white !important;
        }
        .ql-snow .ql-picker-options {
          background: rgb(30, 41, 59) !important;
          border: 1px solid rgb(71, 85, 105) !important;
        }
        .ql-snow .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: white !important;
        }
        .ql-snow .ql-stroke {
          stroke: white !important;
        }
        .ql-editor h2 {
          font-size: 2rem !important;
          font-weight: 600 !important;
          color: white !important;
        }
        .ql-editor h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: white !important;
        }
        .ql-editor blockquote {
          border-left: 4px solid rgb(147, 51, 234) !important;
          color: rgb(203, 213, 225) !important;
          padding-left: 1rem !important;
          font-style: italic !important;
        }
        .ql-editor a {
          color: rgb(147, 51, 234) !important;
        }
        .ql-editor code {
          background: rgb(51, 65, 85) !important;
          color: rgb(248, 113, 113) !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
        }
      `}</style>

        </div>
    </main>
    </>
  )
}

export default PostEditorContent