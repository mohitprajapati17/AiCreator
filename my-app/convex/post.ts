import { v } from "convex/values";
import { mutation } from "./_generated/server";
// create a Post 
export const create=mutation({
    args:{
        title:v.string() ,
        content:v.string(),
        status:v.union(v.literal("draft"),v.literal("published")),
        tags: v.optional(v.array(v.string())),
        category: v.optional(v.string()),
        featuredImage: v.optional(v.string()),
        scheduledFor: v.optional(v.number()),
    },

    handler:async(ctx  ,args)=>{
       const identity=await ctx.auth.getUserIdentity();
       if(!identity){
        throw new Error("User not authenticated");
       }

       //  Get user from database
       const user=await ctx.db.query("users").withIndex("by_token",(q)=>(q.eq("tokenIdentifier",identity.tokenIdentifier))).unique();
       if(!user){
        throw new Error("User not found");

       }

    //    check for existing draft
      const existingDraft=await ctx.db.query("posts").filter((q)=>q.and(q.eq(q.field("status"),"draft"),q.eq(q.field("authorId"),user._id))).unique();

      const now=Date.now();

      // If publishing and we have an existing draft, update it to published
      if(args.status==="published"&&existingDraft){
         await  ctx.db.patch(existingDraft._id,{
            title:args.title,
            content:args.content,
            status:"published",
            tags:args.tags || [],
            category:args.category,
            featuredImage:args.featuredImage,
            updatedAt: now,
            publishedAt: now,
            scheduledFor: args.scheduledFor,

         })
         return  existingDraft._id;
      }

      // If creating a draft and we have an existing draft, update it
      if (args.status === "draft" && existingDraft) {
      await ctx.db.patch(existingDraft._id, {
        title: args.title,
        content: args.content,
        tags: args.tags || [],
        category: args.category,
        featuredImage: args.featuredImage,
        updatedAt: now,
        scheduledFor: args.scheduledFor,
      });
      return existingDraft._id;
    }

     // Create new post (either first draft or direct publish)

     const PostId=await ctx.db.insert("posts",{
        title: args.title,
      content: args.content,
      status: args.status,
      authorId: user._id,
      tags: args.tags || [],
      category: args.category,
      featuredImage: args.featuredImage,
      createdAt: now,
      updatedAt: now,
      publishedAt: args.status === "published" ? now : undefined,
      scheduledFor: args.scheduledFor,
      viewCount: 0,
      likeCount: 0,
     })
     return PostId;

    }

})