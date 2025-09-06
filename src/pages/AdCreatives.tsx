import { useState, useEffect } from "react";
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

export async function fetchAI(prompt: string) {
  const response = await fetch("http://localhost:3002/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      context: "You are an AI assistant helping with upskilling and education."
    })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch from Perplexity AI server");
  }

  const data = await response.json();
  // Perplexity returns { result: { choices: [{ message: { content: ... } }] } }
  let content = data.result?.choices?.[0]?.message?.content || data.result;
  return content;
}

const AdCreatives = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { programName, regions = [], targetPersona = {}, articles = [] } = location.state || {};
  const {
    audienceTypes = [],
    demographics = [],
    industry = ""
  } = targetPersona;

  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ headline: "", body: "", cta: "" });

  // Generate prompts for each region (or article if available)
  useEffect(() => {
    const generateCreatives = async () => {
      setLoading(true);
      try {
        const newCreatives: Creative[] = [];
        for (let i = 0; i < regions.length; i++) {
          const region = regions[i];
          // Find a relevant article for this region if available
          const articleObj = articles.find(
            (a: any) => a.article && a.article.source && a.article.source.toLowerCase().includes(region.toLowerCase())
          ) || articles[i] || {};

          const prompt = [
            `Generate a LinkedIn ad creative for the following program and audience.`,
            `Program Name: ${programName}`,
            `Region: ${region}`,
            `Audience Types: ${audienceTypes.join(", ") || "working professionals"}`,
            demographics.length ? `Demographics: ${demographics.join(", ")}` : "",
            `Industry: ${industry}`,
            articleObj?.article?.title ? `Relevant News Headline: ${articleObj.article.title}` : "",
            articleObj?.article?.description ? `Relevant News Description: ${articleObj.article.description}` : "",
            `The creative should include:`,
            `- A catchy headline (max 12 words)`,
            `- A compelling body text (max 40 words)`,
            `- A strong call to action (max 8 words)`,
            `Return ONLY a valid JSON object with keys: headline, body, cta.`
          ].filter(Boolean).join(" ");

          let aiResult = "";
          try {
            aiResult = await fetchAI(prompt);
          } catch (err) {
            aiResult = "";
          }

          // Try to parse AI result as JSON, fallback to dummy if needed
          let parsed: { headline: string; body: string; cta: string } = {
            headline: "",
            body: "",
            cta: ""
          };
          try {
            parsed = typeof aiResult === "string" ? JSON.parse(aiResult) : aiResult;
          } catch {
            parsed = {
              headline: `Transform Your Career with ${programName || "Our Program"}`,
              body: `Join thousands of professionals who've advanced their careers through our innovative ${programName || "educational program"}.`,
              cta: "Start Your Journey Today"
            };
          }

          newCreatives.push({
            id: (i + 1).toString(),
            region,
            headline: parsed.headline,
            body: parsed.body,
            cta: parsed.cta,
            approved: false
          });
        }
        setCreatives(newCreatives);
      } catch (err) {
        toast({
          title: "AI Error",
          description: "Failed to generate ad creatives. Please try again.",
          variant: "destructive"
        });
      }
      setLoading(false);
    };

    if (regions.length && programName) {
      generateCreatives();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regions, programName, audienceTypes, demographics, industry, articles]);

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
              onClick={() => navigate("/news-article", { state: { programName, targetPersona, regions, articles } })}
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

        {loading ? (
          <div className="text-center text-lg py-16">Generating ad creatives with AI...</div>
        ) : (
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
        )}

        {allApproved && !loading && (
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