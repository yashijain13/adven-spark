import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProgramForm = () => {
  const navigate = useNavigate();
  const [program, setProgram] = useState("");
  const [personas, setPersonas] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [newPersona, setNewPersona] = useState("");
  const [newRegion, setNewRegion] = useState("");

  const programOptions = [
    "MBA Programs",
    "Data Science Bootcamp", 
    "Digital Marketing Certificate",
    "Software Engineering Course",
    "Executive Leadership Program",
    "AI & Machine Learning Track",
    "UX/UI Design Program",
    "Project Management Certification"
  ];

  const personaOptions = [
    "Working Professionals",
    "Recent Graduates", 
    "Career Changers",
    "Executives",
    "Entrepreneurs",
    "Technical Specialists",
    "Creative Professionals",
    "International Students"
  ];

  const regionOptions = [
    "North America",
    "Europe", 
    "Asia-Pacific",
    "Latin America",
    "Middle East & Africa",
    "United Kingdom",
    "Australia & New Zealand",
    "Southeast Asia"
  ];

  const addPersona = (persona: string) => {
    if (persona && !personas.includes(persona)) {
      setPersonas([...personas, persona]);
      setNewPersona("");
    }
  };

  const addRegion = (region: string) => {
    if (region && !regions.includes(region)) {
      setRegions([...regions, region]);
      setNewRegion("");
    }
  };

  const removePersona = (persona: string) => {
    setPersonas(personas.filter(p => p !== persona));
  };

  const removeRegion = (region: string) => {
    setRegions(regions.filter(r => r !== region));
  };

  const handleNext = () => {
    if (!program) {
      toast({
        title: "Program Required",
        description: "Please select a program to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (personas.length === 0) {
      toast({
        title: "Personas Required", 
        description: "Please add at least one persona to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (regions.length === 0) {
      toast({
        title: "Regions Required",
        description: "Please add at least one region to continue.",
        variant: "destructive",
      });
      return;
    }

    navigate("/news-article", { 
      state: { program, personas, regions } 
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-soft">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-foreground">
          Create Your Campaign
        </CardTitle>
        <p className="text-muted-foreground">
          Set up your education marketing campaign in three simple steps
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Program Selection */}
        <div className="space-y-3">
          <Label htmlFor="program" className="text-sm font-medium">
            1. Select Program
          </Label>
          <Select value={program} onValueChange={setProgram}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an education program..." />
            </SelectTrigger>
            <SelectContent>
              {programOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Personas Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            2. Add Target Personas
          </Label>
          <div className="flex gap-2">
            <Select value={newPersona} onValueChange={setNewPersona}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select persona..." />
              </SelectTrigger>
              <SelectContent>
                {personaOptions
                  .filter(option => !personas.includes(option))
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => addPersona(newPersona)}
              size="sm"
              variant="outline"
              disabled={!newPersona || personas.includes(newPersona)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {personas.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-education-red-light rounded-md">
              {personas.map((persona) => (
                <Badge 
                  key={persona} 
                  variant="secondary" 
                  className="bg-white border border-education-red text-education-red"
                >
                  {persona}
                  <button
                    onClick={() => removePersona(persona)}
                    className="ml-2 hover:text-education-red-dark"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Regions Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            3. Add Target Regions
          </Label>
          <div className="flex gap-2">
            <Select value={newRegion} onValueChange={setNewRegion}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select region..." />
              </SelectTrigger>
              <SelectContent>
                {regionOptions
                  .filter(option => !regions.includes(option))
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => addRegion(newRegion)}
              size="sm"
              variant="outline"
              disabled={!newRegion || regions.includes(newRegion)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {regions.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-education-red-light rounded-md">
              {regions.map((region) => (
                <Badge 
                  key={region} 
                  variant="secondary"
                  className="bg-white border border-education-red text-education-red"
                >
                  {region}
                  <button
                    onClick={() => removeRegion(region)}
                    className="ml-2 hover:text-education-red-dark"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button 
          onClick={handleNext}
          className="w-full mt-8"
          variant="hero"
          size="lg"
        >
          Find Relevant News
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProgramForm;