"use client"
import React from 'react'
import { useState } from 'react';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';

function SettingsPage() {
  const [username,setUsername]=useState("");
  const {data:currentUser,isLoading}  =useConvexQuery(api.users.getCurrentUser)

  const handleSubmit =async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!username.trim()){
      toast.error("Username Cannot be empty");
      return  ;

    }
    
  }

  if(isLoading){
    return   <BarLoader width={"100%"} color="#D8B4FE"/>
  }

  return (
    <div className ="space-y-8 p-4 lg:p-8 border border-white">
      <div>
        <h1 className ="text-3xl font-bold gradient-text-primary"> Settings</h1>
        <p className ="text-slate-400 mt-2">
          Manage your  profile  and account prefences
        </p>
      </div>



    </div>
  )
}

export default SettingsPage