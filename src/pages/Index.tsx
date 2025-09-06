import ProgramForm from "@/components/ProgramForm";
import heroImage from "@/assets/hero-education.jpg";
import { GraduationCap, Target, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-education-red-light/50 to-white/30"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Create Targeted
                  <span className="text-education-red block">
                    Education Campaigns
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Generate personalized LinkedIn ad creatives for your education programs with AI-powered insights and localized content for global audiences.
                </p>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-education-red" />
                  <span className="text-sm font-medium text-foreground">Education Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-education-red" />
                  <span className="text-sm font-medium text-foreground">AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-education-red" />
                  <span className="text-sm font-medium text-foreground">Global Reach</span>
                </div>
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Start Your Campaign
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tell us about your education program, target audience, and regions to generate relevant news insights and customized ad creatives.
          </p>
        </div>
        
        <div className="flex justify-center">
          <ProgramForm />
        </div>
      </section>
    </div>
  );
};

export default Index;
