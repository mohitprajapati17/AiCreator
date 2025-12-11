
"use client"
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PostEditor from "@/components/PostEditor";

export default function CreatePage(){
    const {data :existingDraft,isLoading:isDraftLoading}=useConvexQuery(api.post.getUserDraft);

    const {data:currentUser,isLoading:userLoading}=useConvexQuery(api.users.getCurrentUser);

   console.log(isDraftLoading)
    if(userLoading||isDraftLoading){
        return <BarLoader width={"100%"} color="#D8B4FE"/>
    }

    if(!currentUser?.username){
        return<div className ="h-80 bg-slate-800 p-6 flex items-center justify-center">
            <div className ="max-w-2xl w-full  text-center space-y-6">
                <h1 className ="text-3xl font-bold text-white">Username Required</h1>
                <p className ="text-slate-400 text-lg">
                      Set up a username  to create and share your post 
                </p>
                <div className ="flex gap-4 justify-center">
                    <Link href="/dashboard/settings">
                    <Button variant="primary">
                        Setup usernmae
                        <ArrowRightIcon  className  ="h-4 w-4 ml-2"/>
                    </Button>
                    </Link>

                </div>

            </div>
        </div>

    }
    return <PostEditor initialData={existingDraft} mode="create"/>
}