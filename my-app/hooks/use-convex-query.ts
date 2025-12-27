"use client"

import { useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";

export const useConvexQuery = (query:any, ...args:any) => {
  const result = useQuery(query, ...args);

  return {
    data: result ?? null,
    isLoading: result === undefined,
    error: null,
  };
};


export const useConvexMutation=(mutation:any)=>{
  const mutationFn=useMutation(mutation);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate=async(...args:any)=>{
    setIsLoading(true);
    setError(null)
    try{
        const  response=await mutationFn(...args)
        setData(response);
        return response;
    }
    catch(err:any){
        setError(err);
        toast.error(err.message)
        throw  err;
    }
    finally{
        setIsLoading(false);
    }
  }

  return  {mutate,data,isLoading,error}
}