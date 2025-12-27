import { useUser } from "@clerk/nextjs";

export default function  FeedPage(){
    const {user:currentUser}=useUser();
}