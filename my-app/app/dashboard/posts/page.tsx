"use client"

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useConvexQuery } from '@/hooks/use-convex-query'
import { api } from '@/convex/_generated/api'


function page() {
    const {data ,isLoading ,error}=useConvexQuery(api.post.getUserPosts)
  return (
    <div className ="min-h-screen mx-5 my-5 border border-gray-200 px-3">
       <div className ="flex items-center justify-between p-4">
            <div>
                <h2 className=' text-3xl font-bold'>My Posts</h2>
                <p className ="text-gray-500 py-2">Manage your posts here</p>
            </div>

            <div>
                <Button  variant ="primary" className=''>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add New Post
                    </Button>
            </div>
        </div>

        <div className='p-4 rounded-lg border border-gray-600 hover:border-gray-400 min-h-[100px] flex items-center gap-2'>
           <Input type="email" placeholder="Email" />
           <div>
                    <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
            </div>
            <div>
                <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
            </div>
        </div>

        <div className ="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {data?.map((post:any)=>(
                <div key={post._id} className ="p-4 rounded-lg border border-gray-600 hover:border-gray-400 min-h-[100px] flex items-center gap-2">
                    <div className ="border border-gray-600 p-2 rounded-lg  ">
                        <img src={post.featuredImage} alt=""/>
                        
                    </div>
                   
                </div>
            ))}
        </div>
        
        
         
    </div>
  )
}

export default page