"use client"
import { useState } from 'react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const CATEGORIES = [
  "Technology",
  "Design",
  "Marketing",
  "Business",
  "Lifestyle",
  "Education",
  "Health",
  "Travel",
  "Food",
  "Entertainment",
];

function PostEditorSettings({isOpen,onClose,form,mode}:any) {

    const [tagInput , setTagInput]=useState("");
    const {watch ,setValue}=form;
    const watchedValues=watch();

    const addTags=()=>{
        const tag=tagInput.trim().toLowerCase();

        if(tag&&!watchedValues.tags.includes(tag)&&watchedValues.tags.length<10){
            setValue("tags",[...watchedValues.tags,tag]);
            setTagInput("");
        }
        console.log(watchedValues.tags)
    }

    const handleInput=(e:any)=>{
        if(e.key==="Enter"||e.key==","){
            e.preventDefault();
            addTags();
        }
    }

    const removeTag=(tag:string)=>{
        setValue("tags",watchedValues.tags.filter((t:string)=>{
            return t!==tag
        }))
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogTrigger>Open</DialogTrigger>
    <DialogContent className ="max-w-md">
        <DialogHeader>
        <DialogTitle className ="text-white">Post Settings </DialogTitle>
        <DialogDescription>
            Configure your post details 
        </DialogDescription>
        </DialogHeader>
        <div className ="space-y-3 ">
            {/* {category} */}
            <div className ="space-y-2 ">
                
                <label className ="text-white text-sm font-medium ">Category</label>
                
                <Select
                value={watchedValues.category}
                onValueChange={(value)=>setValue("category",value)}
                >
                <SelectTrigger className ="bg-slate-800  border-slate-600">
                    <SelectValue placeholder="Select  category..." />
                </SelectTrigger >
                <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
                </Select>
            </div>

            {/* {Tags} */}
            <div className ="space-y-3">
                <label className="text-white text-sm font-medium">Tags</label>
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleInput}
                placeholder="Add tags..."
                className="bg-slate-800 border-slate-600"
              />
              <Button
                type="button"
                onClick={()=>addTags()}
                variant="outline"
                size="sm"
                className="border-slate-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {watchedValues.tags.length>0&&(
                <div className ="flex-wrap gap-2 flex">
                  {watchedValues.tags.map((tag:string,index:number)=>(
                       <Badge
                       key={index}
                       variant ="secondary"
                       className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                       >
                        {tag}
                        <button
                        type="button"
                        onClick={()=>{removeTag(tag)}}
                        className ="ml-1  hover:text-red-400"

                        >
                            <X className ="h-3 w-3 "/>
                        </button>
                        
                       </Badge>
                  ))}
                </div>
            )}

            </div>

            {mode==="create"&&(
            <div className ="space-y-2">
                <label className ="text-white text-sm font-medium">
                   Sceduled Publication
                </label>
                <Input
                   value={watchedValues.scheduledFor}
                   onChange={(e)=>setValue("scheduledFor",e.target.value)}
                   type="datetime-local"
                   className="bg-slate-800 border-slate-600"
                   min={new Date().toISOString().slice(0,16)}
                />


            </div>
        )}
            <p className ="text-xs text-slate-400">
                {watchedValues.tags.length}/10 tags  . press Enter or comma  to add

            </p>

        </div>

        
    </DialogContent>
    </Dialog>
  )
}

export default PostEditorSettings