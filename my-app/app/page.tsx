import { Button } from "@/components/ui/button";
import Image from "next/image";


export default function Home() {
  return (
    <>
      <div className="bg-black flex items-center justify-center h-screen w-full text-white text-4xl">Hello World
      <Button className="mt-4" variant="primary">Get Started</Button>
      </div>
    </>
  );
}
