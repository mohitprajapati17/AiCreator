// // Get dashboard analytics for the authenticated user
import { convexToJson, v } from "convex/values";
import { query } from "./_generated/server";

export  const getAnalytics=query({
    handler:async (ctx)=>{

        const identity=await ctx.auth.getUserIdentity();
        
        const user=await ctx.db.query("users").filter(q=>q.eq(q.field("tokenIdentifier"),identity?.tokenIdentifier)).unique();

        if(!user){
            return null;
        }

        // get users  all posts
        const posts=await ctx.db.query("posts").filter(q=>q.eq(q.field("authorId"),user._id)).collect();

        // get users follower count
        const followerCount=await ctx.db.query("follows").filter(q=>q.eq(q.field("followingId"), user._id)).collect();
        

        // calculate analytics  
        const totalViews  =posts.reduce((sum,post)=>sum+post.viewCount,0);
        const totalLikes = posts.reduce((sum,post)=>sum+post.likeCount,0);

        // getComments  count  fo users  post
        const postIds=posts.map(post=>post._id);
        let totalComments=0;


        for(const postId of postIds){
            const comments=await ctx.db.query("comments").filter(q=>q.eq(q.field("postId"), postId)).collect();
            totalComments += comments.length;
        }

        // Calculate growth percentages (simplified - you might want to implement proper date-based calculations)
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

        const recentPosts = posts.filter((p) => p.createdAt > thirtyDaysAgo);

        const recentViews = recentPosts.reduce(
            (sum, post) => sum + post.viewCount,
            0
        );
        const recentLikes = recentPosts.reduce(
            (sum, post) => sum + post.likeCount,
            0
        );

         // Simple growth calculation (you can enhance this)
            const viewsGrowth = totalViews > 0 ? (recentViews / totalViews) * 100 : 0;
            const likesGrowth = totalLikes > 0 ? (recentLikes / totalLikes) * 100 : 0;
            const commentsGrowth = totalComments > 0 ? 15 : 0; // Placeholder
            const followersGrowth = followerCount.length > 0 ? 12 : 0; // Placeholder


    return {
        totalViews,
        totalLikes,
        totalComments,
        totalFollowers: followerCount.length,
        viewsGrowth: Math.round(viewsGrowth * 10) / 10,
        likesGrowth: Math.round(likesGrowth * 10) / 10,
        commentsGrowth,
        followersGrowth,
        };
    },
});

// Get recent activity for the dashboard
export  const  getRecetnActivity=query({
    args:{limit :v.optional(v.number())},
    handler:async(ctx ,  args)=>{


         const identity=await ctx.auth.getUserIdentity();
        
        const user=await ctx.db.query("users").filter(q=>q.eq(q.field("tokenIdentifier"),identity?.tokenIdentifier)).unique();

        if(!user){
            return null;
        }

        // get users  all posts
        const posts=await ctx.db.query("posts").filter(q=>q.eq(q.field("authorId"),user._id)).collect();
        
        const postIds=posts.map(p=>p._id);
        

        const activity=[];

        // Get recent likes on user's posts
        for(const postId of postIds){
            const likes=await ctx.db.query("likes").filter((q)=>q.eq(q.field("postId"), postId)).order("desc").take(5);

            for(const like of likes){
                if(like.userId){
                    const likeUser = await ctx.db.get(like.userId);
                    const post = posts.find((p) => p._id === postId);


                     if (likeUser && post) {
                        activity.push({
                        type: "like",
                        user: likeUser.name,
                        post: post.title,
                        time: like.createdAt,
                        });
                    }
                }
            }
            // Process likes...
        }

         // Get recent comments on user's posts
            for (const postId of postIds) {
                const comments = await ctx.db
                    .query("comments")
                    .filter((q) =>
                    q.and(
                        q.eq(q.field("postId"), postId),
                        q.eq(q.field("status"), "approved")
                    )
                    )
                    .order("desc")
                    .take(5);

                for (const comment of comments) {
                    const post = posts.find((p) => p._id === postId);

                    if (post) {
                    activity.push({
                        type: "comment",
                        user: comment.authorName,
                        post: post.title,
                        time: comment.createdAt,
                    });
                    }
                }
            }

            // Get recent followers
        const recentFollowers = await ctx.db
        .query("follows")
        .filter((q) => q.eq(q.field("followingId"), user._id))
        .order("desc")
        .take(5);

        for (const follow of recentFollowers) {
        const follower = await ctx.db.get(follow.followerId);
        if (follower) {
            activity.push({
            type: "follow",
            user: follower.name,
            time: follow.createdAt,
            });
        }
        }

        // Sort all activities by time and limit
        activity.sort((a, b) => b.time - a.time);

        return activity.slice(0, args.limit || 10);



    }
})

// Get posts with analytics for dashboard
export const getPostsWithAnalytics=query({
    args:{limit:v.optional(v.number())},
    handler:async(ctx , args)=>{
        const identity=await ctx.auth.getUserIdentity();

        const  user  =await ctx.db.query("users").filter((q) => q.eq(q.field("tokenIdentifier"), identity?.tokenIdentifier)).unique();
        if(!user) return null;

        const posts=await ctx.db.query("posts")
    }
})