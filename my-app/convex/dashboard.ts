// // Get dashboard analytics for the authenticated user

import { query } from "./_generated/server";

export  const getAnalytics=query({
    handler:async (ctx)=>{

        const identity=await ctx.auth.getUserIdentity();
        
        const user=await ctx.db.query("users").filter(q=>q.eq(q.field("tokenIdentifier"),identity?.tokenIdentifier)).unique();

        if(!user){
            return null;
        }

        

    }
})