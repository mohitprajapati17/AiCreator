"use client"
import React from 'react'
import { useState } from 'react';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, User } from 'lucide-react';
import { useConvexMutation } from "@/hooks/use-convex-query"


function SettingsPage() {
  const [username,setUsername]=useState("");
  const {data:currentUser,isLoading}  =useConvexQuery(api.users.getCurrentUser)

  const {mutate:updateUsername ,isLoading:isSubmitting}=useConvexMutation(api.users.updateUsername)

  const handleSubmit =async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!username.trim()){
      toast.error("Username Cannot be empty");
      return  ;

    }
    await updateUsername({username:username.trim()});
    toast.success("Username update succesfully")
    
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

      <Card className="card-glass max-w-2xl">
      <CardHeader>
        <CardTitle className ="text-white flex items-center">
          <User className  ="h-5 w-5 mr-2"/>
          UserName Settings
        </CardTitle>
        <CardDescription>
          set your unique  username  for your profile
        </CardDescription>

      </CardHeader>
      <CardContent>
        <form className ="space-y-2" onSubmit ={handleSubmit}>
          
            
              <Label htmlFor="username" className="text-white">Username </Label>
              <Input
                id="username"
                type={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder="Enter your username"
                className ="bg-slate-800 border-slate-800 text-white"
              />
              {currentUser?.username&&(
                <div className ="text-sm text-slate-400">
                  Current Username:{" "}
                  <span className ="text-white">@{currentUser.username}</span>

                </div>

              )}
              <div className ="text-xs text-slate-500">
                3-20 characters ,  letter , numbers , underscores , and hyphens  only
                </div>
              
              <div className  ="flex justify-end">
                <Button
                type="submit"
                 variant="primary"
                 className="w-full sm:w-auto "
                 disabled={isSubmitting}
                >
                  {isSubmitting?(
                  <>
                  <Loader2 className="h-4 w-4 mr-2 animated-spin"/> 
                  Loading ..
                  
                  </>
                ):(
                  "Update username"
                )}
                  

                </Button>
                

              </div>
            
            
       
        </form>
      </CardContent>
      
    </Card>



    </div>
  )
}

export default SettingsPage