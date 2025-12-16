import ImageKit from "imagekit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''
});

export  async function POST(request){
    try{
         // Verify authentication
        const user=await auth();
        if(!user){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

    }
}