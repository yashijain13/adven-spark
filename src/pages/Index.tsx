import ProgramForm from "@/components/ProgramForm";
import heroImage from "@/assets/hero-education.jpg";
import { GraduationCap, Target, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-education-red-light/50 to-white/30"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground text-education-red leading-tight">
                  upgrAD Engine
                </h1>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <img 
                src={heroImage} 
                alt="Education marketing platform hero image"
                className="rounded-xl shadow-soft max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        
        <div className="flex justify-center">
          <ProgramForm />
        </div>
      </section>
    </div>
  );
};

export default Index;
