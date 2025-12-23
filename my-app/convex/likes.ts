
import { mutation ,query} from "./_generated/server";
import { v } from "convex/values";

// Toggle a like
export const toggleLike=mutation({
    args:{
        postId:v.id("posts"),
        userId:v.optional(v.id("users")),

    },
    handler:async( ctx , args)=>{
        let userId=args.userId;
        if(!userId){
            const identity =await ctx.auth.getUserIdentity();
            if(!identity){
                throw new Error("Must be logged in to like posts");
            }
            const user=await ctx.db.query("users").filter((q)=>q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)).unique();
            if(!user){
                throw new Error("User not found");
            }
            userId=user._id;
        }

        const post=await ctx.db.query("posts").filter((q)=>q.eq(q.field("_id"), args.postId)).unique();
        if(!post || post.status !== "published"){
            throw new Error("Post not found or not published");
        }
        
        let existingLike;
        if(userId){
            existingLike=await ctx.db.query("likes").filter((q)=>q.and(q.eq(q.field("postId"), args.postId), q.eq(q.field("userId"), userId))).unique();
        }

        if(existingLike){
            await ctx.db.delete(existingLike._id);
             // Decrement like count
            await ctx.db.patch(args.postId, {
                likeCount: Math.max(0, post.likeCount - 1),
            });

            return { liked: false, likeCount: Math.max(0, post.likeCount - 1) };
        }

        await ctx.db.insert("likes", {
            postId: args.postId,
            userId,
            createdAt: Date.now(),
        });

        // Increment like count
        await ctx.db.patch(args.postId, {
            likeCount: post.likeCount + 1,
        });
        return { liked: true, likeCount: post.likeCount + 1 };
    }
})


export const hasUserLiked=query({
    args:{
        postId:v.id("posts"),
        userId: v.optional(v.id("users")),
    },
    handler:async(ctx , args)=>{
        let userId=args.userId;
        if(!userId){
            const identity =await ctx.auth.getUserIdentity();
            if(!identity){
                throw new Error("Must be logged in to like posts");
            }
            const user=await ctx.db.query("users").filter((q)=>q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)).unique();
            if(!user){
                throw new Error("User not found");
            }
            userId=user._id;
        }
        const post=await ctx.db.query("posts").filter((q)=>q.eq(q.field("_id"), args.postId)).unique();
        if(!post || post.status !== "published"){
            throw new Error("Post not found or not published");
        }

        const existingLike=await ctx.db.query("likes").filter((q)=>q.and(q.eq(q.field("postId"), args.postId), q.eq(q.field("userId"), userId))).unique();
        return !!existingLike;
        
    }


})