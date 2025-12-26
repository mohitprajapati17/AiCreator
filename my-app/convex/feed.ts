import { v } from "convex/values";
import { query } from "./_generated/server";
export const getFeed=query({
    args:{
        limit:v.optional(v.number())
    },
    handler:async(ctx , args)=>{

    }
})

