import { CabientForm } from "@/components/cabinet-form";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-2 gap-1 h-screen">
        <div className="bg-gray-300 h-full flex flex-col justify-center items-center">
          <h1>Make a cabinet</h1>
          <CabientForm />
      
        </div>
      </div>
    </>
  );
}
