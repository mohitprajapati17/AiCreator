import { useQuery } from "convex/react";
import { useState } from "react";

export const useConvexQuery=(query:any,...args:any)=>{
    const  result =useQuery(query,...args)
    const [data,setData]=useState(undefined);
    const  [loading  , setLoading]=useState(true);
    const [error , setError]=useState(null)

}