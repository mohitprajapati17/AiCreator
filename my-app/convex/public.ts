import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export  const getPublicPostByUsername=query({
    args:{
        username :v.string(),
        limit: v.optional(v.number()),
        cursor: v.optional(v.string()),
    },
    handler:async(ctx,args)=>{
        const user=await ctx.db.query("users").filter((q)=>q.eq (q.field("username"),args.username)).unique();

        if(!user){
            return { posts: [], hasMore: false };
        }

        const query=ctx.db.query("posts").filter((q)=>q.and(q.eq(q.field("authorId"),user._id),q.eq(q.field("status"), "published"))).order("desc");
        
    }


})