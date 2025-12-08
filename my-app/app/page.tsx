"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Star } from "lucide-react";


export default function Home() {

  const [mousePosition,setMousePosition]=useState({x:0,y:0})
  const [activeTab,setActiveTab]=useState(0);

  useEffect(()=>{
    const handleMouseMove=(e:any)=>{
      setMousePosition({x:e.clientX,y:e.clientY});

    }
    window.addEventListener("mousemove",handleMouseMove)
    return ()=>{
      window.removeEventListener("mousemove",handleMouseMove)
    };
  },[]);

  // Data arrays
  const navigationItems=[
    {label:"Features",href:"#features"},
    {label:"About",href:"#about"},
    
  ]


  return (
    <>
      <div className  ="bg-black min-h-screen text-white overflow-hidden relative">
         {/* {Animated gradient background} */}
         <div className ="fixed inset-0  bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20 animated-pulse">
            {/* Dynamic cursor effect */}
            <div className="fixed w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full  pointer-events-none z-0"
                style={{
                  left:mousePosition.x-192,
                  top: mousePosition.y - 192,
                  transition: "all 0.1s ease-out",
                }}
            ></div>

            {/* hero section  */}

            <section className ="relative z-10 mt-48 px-4 sm:px-6 ">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2  gap-8 lg:gap-12  items-center" >
                  <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                    <div className="space-y-4 sm:space-y-6">
                      <h1 className="text-7xl lg:text-8xl font-black leading-none tracking-tight">
                        <span className="block font-black text-white">Create.</span>
                        <span className="block font-light italic text-purple-300">
                          Publish.
                        </span>
                        <span className="block font-black bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                          Grow.
                        </span>
                      </h1>

                      <p className ="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-2xl md:max-w-none">
                           The AI-powered platform that turns your ideas into{" "}
                          <span className="text-purple-300 font-semibold">
                            engaging content
                          </span>{" "}
                          and helps you build a thriving creator business.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                    <Link href="/dashboard">
                      <Button
                        size="xl"
                        variant="primary"
                        className="rounded-full w-full sm:w-auto text-white"
                      >
                        Start Creating for Free
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/feed">
                      <Button
                        variant="outline"
                        size="xl"
                        className="rounded-full w-full sm:w-auto"
                      >
                        Explore the Feed
                      </Button>
                    </Link>
                    </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                  ].map((src, i) => (
                    <div key={i} className="relative w-6 h-6 sm:w-8 sm:h-8">
                      <Image
                        src={src}
                        alt={`Creator ${i + 1}`}
                        fill
                        className="rounded-full border-2 border-black object-cover"
                        sizes="32px"
                      />
                    </div>
                  ))}
                </div>
                <span>10k+ creators</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-1">4.9/5</span>
              </div>
            </div>

                  </div>


                   {/* Interactive 3D-style elements */}
          <div>
            <Image
              src="/banner.png"
              alt="Platform Banner"
              width={500}
              height={700}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
                </div>
            </section>
         </div>
      </div>
    </>
  );
}
