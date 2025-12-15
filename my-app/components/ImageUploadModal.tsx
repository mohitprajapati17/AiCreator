"use client"

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useState } from 'react'

function ImageUploadModal( {isOpen , onClose ,  onImageSelect , title}:{isOpen:boolean , onClose:()=>void , onImageSelect:(imageData:any)=>void , title:string}) {

  const [activeTabs, setActiveTabs]=useState("upload")
  const [uploadedImage, setUploadedImage]=useState<string | null>(null)

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
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">Make changes to your account here.</TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
  </Tabs>
  </DialogContent>
</Dialog>
  )
}

export default ImageUploadModal