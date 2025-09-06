import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft, Edit3, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Creative {
  id: string;
  region: string;
  headline: string;
  body: string;
  cta: string;
  approved: boolean;
}

const AdCreatives = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { program, personas, regions, approvedArticle } = location.state || {};
  
  const [creatives, setCreatives] = useState<Creative[]>([
    {
      id: "1",
      region: regions?.[0] || "North America",
      headline: `Transform Your Career with ${program || "Our Program"}`,
      body: `Join thousands of professionals who've advanced their careers through our innovative ${program || "educational program"}. Designed specifically for ${personas?.[0] || "working professionals"}, our flexible learning approach fits your busy schedule.`,
      cta: "Start Your Journey Today",
      approved: false,
    },
    {
      id: "2", 
      region: regions?.[1] || "Europe",
      headline: `${program || "Professional Development"} That Actually Works`,
      body: `Stop wasting time on outdated training. Our cutting-edge ${program || "program"} delivers real results for ${personas?.[1] || "career-focused individuals"}. Join the education revolution that's changing lives across ${regions?.[1] || "Europe"}.`,
      cta: "Enroll Now - Limited Spots",
      approved: false,
    },
    {
      id: "3",
      region: regions?.[2] || "Asia-Pacific", 
      headline: `Future-Proof Your Skills with ${program || "Expert Training"}`,
      body: `Stay ahead of the curve with industry-leading ${program || "education programs"}. Perfect for ${personas?.[2] || "ambitious professionals"} looking to excel in today's competitive market. Localized for ${regions?.[2] || "Asia-Pacific"} markets.`,
      cta: "Secure Your Spot",
      approved: false,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ headline: "", body: "", cta: "" });

  const handleEdit = (creative: Creative) => {
    setEditingId(creative.id);
    setEditForm({
      headline: creative.headline,
      body: creative.body, 
      cta: creative.cta,
    });
  };

  const handleSaveEdit = (id: string) => {
    setCreatives(prev => prev.map(creative =>
      creative.id === id 
        ? { ...creative, ...editForm }
        : creative
    ));
    setEditingId(null);
    toast({
      title: "Creative Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleApprove = (id: string) => {
    setCreatives(prev => prev.map(creative =>
      creative.id === id 
        ? { ...creative, approved: true }
        : creative
    ));
    toast({
      title: "Creative Approved",
      description: "Ad creative has been approved and is ready for deployment.",
    });
  };

  const handleBulkApprove = () => {
    setCreatives(prev => prev.map(creative => ({ ...creative, approved: true })));
    toast({
      title: "All Creatives Approved", 
      description: "All ad creatives have been approved for deployment.",
    });
  };

  const allApproved = creatives.every(c => c.approved);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/news-article", { state: { program, personas, regions } })}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">LinkedIn Ad Creatives</h1>
              <p className="text-muted-foreground">
                Localized for: {regions?.join(", ") || "Selected regions"}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleBulkApprove}
            disabled={allApproved}
            className="bg-gradient-red hover:bg-education-red-dark"
          >
            {allApproved ? "All Approved" : "Approve All"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {creatives.map((creative) => (
            <Card key={creative.id} className="shadow-soft relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-medium">
                    {creative.region}
                  </Badge>
                  {creative.approved && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {editingId === creative.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`headline-${creative.id}`}>Headline</Label>
                      <Input
                        id={`headline-${creative.id}`}
                        value={editForm.headline}
                        onChange={(e) => setEditForm(prev => ({ ...prev, headline: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`body-${creative.id}`}>Body Text</Label>
                      <Textarea
                        id={`body-${creative.id}`}
                        value={editForm.body}
                        onChange={(e) => setEditForm(prev => ({ ...prev, body: e.target.value }))}
                        rows={4}
                        className="mt-1 resize-none"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`cta-${creative.id}`}>Call to Action</Label>
                      <Input
                        id={`cta-${creative.id}`}
                        value={editForm.cta}
                        onChange={(e) => setEditForm(prev => ({ ...prev, cta: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(creative.id)}
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gradient-subtle border border-border rounded-lg p-4 space-y-3">
                      <h3 className="font-bold text-lg text-foreground leading-tight">
                        {creative.headline}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {creative.body}
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-red hover:bg-education-red-dark"
                      >
                        {creative.cta}
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(creative)}
                        className="flex items-center gap-2 flex-1"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(creative.id)}
                        disabled={creative.approved}
                        className="flex items-center gap-2 flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {creative.approved ? "Approved" : "Approve"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {allApproved && (
          <div className="text-center p-8 bg-gradient-subtle rounded-lg border border-border">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              All Creatives Approved!
            </h3>
            <p className="text-muted-foreground">
              Your LinkedIn ad campaigns are ready for deployment across all selected regions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdCreatives;