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
  const [regions, setRegions] = useState<string[]>([]);
  const [newRegion, setNewRegion] = useState("");
  const [programName, setProgramName] = useState("");

  // Add new state for the new persona fields
  const [industry, setIndustry] = useState("");
  const [otherIndustry, setOtherIndustry] = useState("");
  const [audienceTypes, setAudienceTypes] = useState<string[]>([]);
  const [demographics, setDemographics] = useState<string[]>([]);
  const [otherDemographic, setOtherDemographic] = useState("");
  const [workExperiences, setWorkExperiences] = useState<string[]>([]);

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
    "Ahmedabad",
    "Bangalore", 
    "New Delhi",
    "Guwahati",
    "Kolkata",
    "Chandigarh",
    "Mumbai",
    "Chennai"
  ];

  const addRegion = (region: string) => {
    if (region && !regions.includes(region)) {
      setRegions(Array.from(new Set([...regions, region])));
      setNewRegion("");
    }
  };

  const removeRegion = (region: string) => {
    setRegions(regions.filter(r => r !== region));
  };

  const handleNext = () => {
    // Validate Program Details
    if (!programName.trim()) {
      toast({
        title: "Program Name Required",
        description: "Please enter the program name to continue.",
        variant: "destructive",
      });
      return;
    }
    if (!program.trim()) {
      toast({
        title: "Program Details Required",
        description: "Please provide program details to continue.",
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

    // Validate Target Persona fields
    if (audienceTypes.length === 0) {
      toast({
        title: "Audience Type Required",
        description: "Please select at least one audience type.",
        variant: "destructive",
      });
      return;
    }
    if (workExperiences.length === 0) {
      toast({
        title: "Work Experience Required",
        description: "Please select at least one work experience range.",
        variant: "destructive",
      });
      return;
    }
    if (!industry) {
      toast({
        title: "Industry Required",
        description: "Please select an industry.",
        variant: "destructive",
      });
      return;
    }
    if (industry === "Others" && !otherIndustry.trim()) {
      toast({
        title: "Other Industry Required",
        description: "Please specify the industry.",
        variant: "destructive",
      });
      return;
    }

    // Pass all target persona info as state
    navigate("/news-article", { 
      state: { 
        programName,
        program,
        regions,
        targetPersona: {
          audienceTypes,
          demographics,
          workExperiences,
          industry: industry === "Others" ? otherIndustry : industry,
        }
      } 
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-soft">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-foreground">
          Create your ad campaign in a few simple steps
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Program Name Input */}
        <div className="space-y-3">
          <Label htmlFor="programName" className="text-sm font-medium">
            1. Program Name
          </Label>
          <input
            type="text"
            id="programName"
            name="programName"
            value={programName}
            onChange={(e) => {
              // Limit to 20 words
              const words = e.target.value.split(/\s+/).slice(0, 20);
              setProgramName(words.join(" "));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-education-red focus:ring focus:ring-education-red/20 sm:text-base py-3 px-4"
            placeholder="Enter program name"
          />
          <div className="text-xs text-muted-foreground text-right">
            {programName.trim() ? programName.trim().split(/\s+/).length : 0}/20 words
          </div>
        </div>

        {/* Program Selection */}
        <div className="space-y-3">
          <Label htmlFor="program" className="text-sm font-medium">
            2. Program Details
          </Label>
          <textarea
            id="program"
            name="program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-education-red focus:ring focus:ring-education-red/20 sm:text-base py-3 px-4"
            placeholder="Provide detailed context about the program (eg. duration, format, description, content and more)"
            rows={4}
          />
        </div>

        {/* Regions Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            3. Target Regions
          </Label>
          <div className="flex gap-2">
            <Select value={newRegion} onValueChange={addRegion}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select 1 to 8 cities" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions
                .sort()
                  .filter(option => !regions.includes(option))
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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

        {/* Target Personas Section */}
        <div className="space-y-6 border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground">Target Persona</h3>
          
          {/* a. Audience Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              a. Audience Type
            </Label>
            <Select
              value=""
              onValueChange={value => {
                if (value && !audienceTypes.includes(value)) {
                  setAudienceTypes([...audienceTypes, value]);
                }
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select audience type..." />
              </SelectTrigger>
              <SelectContent>
                {personaOptions
                  .filter(option => !audienceTypes.includes(option))
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {audienceTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-education-red-light rounded-md">
                {audienceTypes.map((type) => (
                  <Badge 
                    key={type} 
                    variant="secondary" 
                    className="bg-white border border-education-red text-education-red"
                  >
                    {type}
                    <button
                      onClick={() => setAudienceTypes(audienceTypes.filter(t => t !== type))}
                      className="ml-2 hover:text-education-red-dark"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* b. Demographic */}
          <div className="space-y-2">
            <Label htmlFor="demographic" className="text-sm font-medium">
              b. Demographic
            </Label>
            <Select
              value=""
              onValueChange={value => {
                if (value && !demographics.includes(value)) {
                  setDemographics([...demographics, value]);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select demographic..." />
              </SelectTrigger>
              <SelectContent>
                {["males", "females", "gender agnostic", "Others - please specify"]
                  .filter(option => !demographics.includes(option))
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {demographics.includes("Others - please specify") && (
              <input
                type="text"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-education-red focus:ring focus:ring-education-red/20 sm:text-base py-2 px-3"
                placeholder="Please specify demographic"
                value={otherDemographic}
                onChange={e => setOtherDemographic(e.target.value)}
              />
            )}
            {demographics.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-education-red-light rounded-md">
                {demographics.map((demo) => (
                  <Badge 
                    key={demo} 
                    variant="secondary" 
                    className="bg-white border border-education-red text-education-red"
                  >
                    {demo.charAt(0).toUpperCase() + demo.slice(1)}
                    <button
                      onClick={() => setDemographics(demographics.filter(d => d !== demo))}
                      className="ml-2 hover:text-education-red-dark"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* c. Work Experience */}
          <div className="space-y-2">
            <Label htmlFor="workExperience" className="text-sm font-medium">
              c. Work Experience (in years)
            </Label>
            <Select
              value=""
              onValueChange={value => {
                if (value && !workExperiences.includes(value)) {
                  setWorkExperiences([...workExperiences, value]);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select work experience..." />
              </SelectTrigger>
              <SelectContent>
                {["0-5", "5-10", "10-15", "15-20"]
                  .filter(option => !workExperiences.includes(option))
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.replace("-", " to ")}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {workExperiences.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-education-red-light rounded-md">
                {workExperiences.map((exp) => (
                  <Badge 
                    key={exp} 
                    variant="secondary" 
                    className="bg-white border border-education-red text-education-red"
                  >
                    {exp.replace("-", " to ")}
                    <button
                      onClick={() => setWorkExperiences(workExperiences.filter(e => e !== exp))}
                      className="ml-2 hover:text-education-red-dark"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* d. Industry (single select, unchanged) */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm font-medium">
              d. Industry
            </Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select industry..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BFSI">BFSI</SelectItem>
                <SelectItem value="IT-ITES">IT-ITES</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Hospitality">Hospitality</SelectItem>
                <SelectItem value="Auto">Auto</SelectItem>
                <SelectItem value="Others">Others - please specify</SelectItem>
              </SelectContent>
            </Select>
            {industry === "Others" && (
              <input
                type="text"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-education-red focus:ring focus:ring-education-red/20 sm:text-base py-2 px-3"
                placeholder="Please specify industry"
                value={otherIndustry}
                onChange={e => setOtherIndustry(e.target.value)}
              />
            )}
          </div>
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