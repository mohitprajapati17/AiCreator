
import { mutation ,query } from "./_generated/server";
import { v } from "convex/values";

// Add a comment to a post
export const addComment=mutation({
    args:{
        postId:v.id("posts"),
        comment:v.string(),
    },
    handler:async(ctx , args)=>{
        const identity=await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Must be logged in to comment");
        }
        const user=await ctx.db.query("users").filter((q)=>q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)).unique();
        if(!user){
            throw new Error("User not found");
        }
        const post=await ctx.db.query("posts").filter((q)=>q.eq(q.field("_id"), args.postId)).unique();
        if(!post){
            throw new Error("Post not found");
        }
        const commentId=await ctx.db.insert("comments", {
            postId: args.postId,
            authorId: user._id,
            authorName: user.name,
            authorEmail: user.email,
            content: args.comment.trim(),
            status:"approved",  // Auto-approve since only authenticated users can comment
            createdAt: Date.now(),
        });

        return commentId;
        
    }
})

// Get Comments for a post
export const getPostComments=query({
    args:{
        postId:v.id("posts"),
    },
    handler:async(ctx , args)=>{
        const comments = await ctx.db
        .query("comments")
        .filter((q) =>
            q.and(
            q.eq(q.field("postId"), args.postId),
            q.eq(q.field("status"), "approved")
            )
        )
        .order("asc")
        .collect();


        // Add user info for all comments (since all are from authenticated users)
        const commentsWithUsers = await Promise.all(
        comments.map(async (comment:any) => {
            if (!comment.authorId) return null;
            const user = await ctx.db.get(comment.authorId);
            if (!user || !('name' in user)) return null;
            return {
            ...comment,
            author: {
                _id: user._id,
                name: user.name,
                username: user.username,
                imageUrl: user.imageUrl,
            },
            };
        })
        );

        return commentsWithUsers.filter((comment:any) => comment.author !== null);
    }
})


// Delete a comment (only by author or post owner)
export const deleteComment=mutation({
    args:{
        commentId:v.id("comments"),
    }
    ,
    handler:async(ctx , args)=>{
        const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    // Get the post to check if user is the post owner
    const post = await ctx.db.get(comment.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user can delete this comment (comment author or post owner)
    const canDelete =
      comment.authorId === user._id || post.authorId === user._id;
    
    if (!canDelete) {
      throw new Error("Not authorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);
    return { success: true };

}
})