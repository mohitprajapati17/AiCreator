import { useQuery } from "convex/react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";

export const useConvexQuery=<T>(query:any,...args:any)=>{
    const  result =useQuery(query,...args)
    const [data,setData]=useState<T | undefined>(undefined);
    const  [isLoading  , setIsLoading]=useState(true);  
    const [error , setError]=useState<any | null>(null)

    // Use effect to handle the state changes based on the query result
    useEffect(()=>{
        if(result ==undefined){
            setIsLoading(true);
        }
        else{
            try{
                setData(result);
                setError(null);
            }
            catch(err:any){
                 setError(err);
                 toast.error(err.message)
            }finally{
                setIsLoading(false);
            }
        }

    },[result])

    return  {data,isLoading,error}

}

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