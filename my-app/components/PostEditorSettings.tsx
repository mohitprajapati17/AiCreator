"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function PostEditorSettings({isOpen,onClose,form,mode}:any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Post Settings </DialogTitle>
      <DialogDescription>
        Configure your post details 
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default PostEditorSettings