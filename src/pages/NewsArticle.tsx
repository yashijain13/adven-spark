import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle, ArrowLeft } from "lucide-react";

const NewsArticle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { program, personas, regions } = location.state || {};
  
  const [article, setArticle] = useState({
    title: "Revolutionary Digital Learning Platform Transforms Education Sector",
    source: "Education Technology News",
    date: "2024-01-15",
    content: `A groundbreaking digital learning platform has been making waves in the education sector, particularly in ${regions?.join(", ") || "various regions"}. The platform, designed for ${program || "various programs"}, has shown remarkable success in engaging ${personas?.join(", ") || "diverse personas"}.

The innovative approach combines traditional pedagogical methods with cutting-edge technology, creating an immersive learning environment that adapts to individual student needs. Early adoption has shown a 40% increase in student engagement and a 25% improvement in learning outcomes.

Educational institutions across the region are now implementing this technology as part of their digital transformation initiatives, with particular success in reaching new demographics and improving accessibility for diverse learning communities.`
  });

  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetch = async () => {
    setIsRefetching(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update with new mock article
    setArticle({
      title: `${program || "Educational Programs"} See Surge in Adoption Across ${regions?.[0] || "Target Markets"}`,
      source: "Global Education Report",
      date: "2024-01-16",
      content: `Recent market analysis reveals unprecedented growth in ${program || "educational program"} adoption, with ${personas?.join(" and ") || "key demographics"} showing increased engagement. The trend is particularly pronounced in ${regions?.join(", ") || "regional markets"}.

Industry experts attribute this growth to innovative marketing strategies and targeted outreach programs that resonate with local communities. The success demonstrates the effectiveness of localized approaches in the education sector.

Market research indicates this trend will continue throughout 2024, with projections showing sustained growth in program enrollment and student satisfaction rates.`
    });
    setIsRefetching(false);
  };

  const handleApprove = () => {
    navigate("/ad-creatives", { 
      state: { program, personas, regions, approvedArticle: article } 
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relevant News Article</h1>
            <p className="text-muted-foreground">
              Based on: {program} • {personas?.join(", ")} • {regions?.join(", ")}
            </p>
          </div>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold leading-tight">
                  {article.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{article.source}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleRefetch}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Refetching...' : 'Refetch Article'}
          </Button>
          
          <Button
            onClick={handleApprove}
            className="flex items-center gap-2 bg-gradient-red hover:bg-education-red-dark"
          >
            <CheckCircle className="h-4 w-4" />
            Approve & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;