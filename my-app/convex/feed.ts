import { v } from "convex/values";
import { query } from "./_generated/server";
export const getFeed=query({
    args:{
        limit:v.optional(v.number())
    },
    handler:async(ctx , args)=>{
        const limit=args.limit || 10;

        const allPosts=await ctx.db.query("posts").filter((q)=>q.eq(q.field("status"),"published")).order("desc").take(limit+1);

        const  hasMore=allPosts.length>limit;

        const feedPosts=hasMore?allPosts.slice(0,limit):allPosts;
        
    }
})

