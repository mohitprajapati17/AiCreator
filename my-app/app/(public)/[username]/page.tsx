"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs';
import { useConvexQuery, useConvexMutation } from '@/hooks/use-convex-query';
import { api } from '@/convex/_generated/api';
import { notFound, useParams } from 'next/navigation';
import PublicHeader from "./_components/publicHeader";
import Image from 'next/image';
import { Eye, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import PostCard from '@/components/PostCard';

import { CardContent,Card } from '@/components/ui/card';
function page() {
    const params = useParams();
    const username = params.username as string;
    const {user :currentUser}=useUser()

    const {data:user ,isLoading :userLoading,error:userError}=useConvexQuery(api.users.getByUsername, { username });

    const {data:postData ,isLoading :postLoading}=useConvexQuery(
        api.public.getPublicPostByUsername,{username ,limit:20}
    )

    // Get follower count 
    const {data: followerCount} = useConvexQuery(api.follow.getFollowerCount, { userId: user?._id });

    // check if user is following this profile 
    const {data :isFollowing}=useConvexQuery(api.follow.isFollowing, currentUser && user ? { followingId: user._id } : "skip");

    const toggleFollow = useConvexMutation(api.follow.toggleFollow);

     
  if (postLoading||userLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if(!user||userError){
    return notFound()
  }

  const  posts=postData?.posts||[];
  
  const isOwnProfile=currentUser && currentUser.publicMetadata?.username === user.username;

  const handleFollowToggle=async()=>{
    if(!currentUser){
        toast.error("please sign in to follow ")
        return;
    }

    try{
        await toggleFollow.mutate({followingId:user._id})
    } catch (error:any) {

        toast.error(error.message||"Failed to toggle follow");
    }
  }

  return (
    <div className ="min-h-screen bg-slate-900 text-white">
        <PublicHeader link="/" title="Back to Home" />
       <div className ="max-w-7xl mx-auto px-6 py-12">
            <div className ="text-center mb-12 ">
                 {/* {Image} */}
                 

                 <div className ="flex justify-center relative w-24 h-24 mx-auto mb-6 ">
                    {user.imageUrl?(
                        <Image
                         src={user.imageUrl}
                         alt={user.name }
                         width={96}
                       height={96}
                         className="object-cover border-2 border-slate-700 rounded-full"
                         sizes="96px"
                        />
                    ):(
                       <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
                        
                         {user.name?.charAt(0).toUpperCase()}
                       </div>

                    )}

                 </div>
                 {/* {username} */}
                 <h1 className ="text-4xl font-bold mb-2 gradient-text-primary ">
                    {user.name}
                </h1>

                <p className ='text-xl text-slate-400 mb-4'>@{user.username}</p>
                 {/* {follow button} */}

                 {!isOwnProfile &&currentUser &&(
                    <Button
                    onClick={handleFollowToggle}
                    disabled={toggleFollow.isLoading}
                    variant={isFollowing?"outline":"primary"}
                    className ="mb-4"
                    >
                        {isFollowing?(
                            <>
                            <UserCheck className='h-4 w-4 mr-2'
                            />
                            Following
                            </>
                        ):(
                            <>
                            <UserPlus className ="h-4 w-4 mr-2"/>
                            Follow
                            </>
                        )}

                    </Button>
                 )}

                 <div className ="flex items-center justify-center text-slate-500 text-sm">
                    <Calendar className ="h-4 w-4 mr-2"/>
                    joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US",{
                        month:"long",
                        year:"numeric"
                    })}
                   </div>

                   <div className ="flex justify-center gap-8 mb-12 ">
                    <div className ="text-center">
                        <div className ="text-2xl font-bold text-white">
                             {posts.length}
                        </div>
                        <div className ="text-sm text-slate-200"> posts</div>

                    </div>
                    <div className ="text-center">
                        <div className ="text-2xl font-bold text-white">
                             {followerCount || 0}
                        </div>
                        <div className ="text-sm text-slate-200"> followers</div>

                    </div>
                    </div>

                    <div className ="space-y-6">
                        <h2 className ="text-lg font-semibold text-white">Recent Posts</h2>
                        {posts.length==0?(
                            <Card className ="card-glass">
                                <CardContent className="text-center py-12">
                                    <p className="text-slate-400 text-lg ">No posts yet</p>
                                    <p className="text-slate-400 text-lg ">Check back later for new content</p>

                                </CardContent>

                            </Card>
                        ):(
                            <div className ="grid grid:cols-1 md:grid:cols-2 lg:grid-cols-3 gap-4"> 
                            {posts.map((post:any)=>{
                                return <PostCard
                                key={post._id}
                                post={post}
                                showActions={false}
                                showAuthor={false}
                                />
                            })}
                            </div>
                        )}

                    </div>
                 
            </div>
        </div>
    </div>
  )
}

export default page