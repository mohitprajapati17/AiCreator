// // Get dashboard analytics for the authenticated user

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