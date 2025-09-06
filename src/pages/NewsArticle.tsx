import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";

// Helper to build a relevant query for upskilling/education
const buildQuery = (keyword1: string, keyword2: string) => {
  let keywords = [
    keyword1,
    keyword2,
    "upskilling",
    "working professionals",
    "continuous education",
    "career growth",
    "education trends",
    "skills development"
  ].filter(Boolean);

  return keywords.join(" ");
};

const fetchNewsArticle = async (keyword1: string, keyword2: string) => {
  const query = buildQuery(keyword1, keyword2);
  const r = await fetch(
    `http://localhost:3001/api/news?q=${encodeURIComponent(query)}`
  );
  if (!r.ok) throw new Error('Failed to fetch news');
  return r.json();
};

// Deep compare articles for uniqueness
function isArticleEqual(a: any, b: any) {
  if (!a || !b) return false;
  return (
    a.title === b.title &&
    a.url === b.url &&
    a.source === b.source &&
    a.published_at === b.published_at
  );
}

function dedupeArticles(arr: { pair: [string, string]; article: any }[]) {
  const unique: { pair: [string, string]; article: any }[] = [];
  arr.forEach(item => {
    if (
      item.article &&
      !unique.some(u => isArticleEqual(u.article, item.article))
    ) {
      unique.push(item);
    }
  });
  // Add non-article pairs (for which no article was found)
  arr.forEach(item => {
    if (!item.article) unique.push(item);
  });
  return unique;
}

const NewsArticle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { programName, regions = [], targetPersona = {} } = location.state || {};
  const {
    audienceTypes = [],
    demographics = [],
    industry = ""
  } = targetPersona;

  // Generate all pairs (at most 2 keywords) from programName, region, demographic, audienceType, industry
  const keywordsArr = [
    programName,
    ...regions,
    ...demographics,
    ...audienceTypes,
    industry
  ].filter(Boolean);

  // Generate all unique pairs (order doesn't matter, no duplicates)
  const pairs: Array<[string, string]> = [];
  for (let i = 0; i < keywordsArr.length; i++) {
    for (let j = i + 1; j < keywordsArr.length; j++) {
      pairs.push([keywordsArr[i], keywordsArr[j]]);
    }
  }
  if (keywordsArr.length === 1) {
    pairs.push([keywordsArr[0], ""]);
  }

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discarded, setDiscarded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          pairs.map(async (pair) => {
            const [k1, k2] = pair as [string, string];
            try {
              // Try with both keywords
              let data = await fetchNewsArticle(k1, k2);
              let article = data.items && data.items.length > 0 ? data.items[0] : null;

              // If no relevant article, try again with "India" as region
              if (!article) {
                data = await fetchNewsArticle(k1, "India");
                article = data.items && data.items.length > 0 ? data.items[0] : null;
              }

              // Only accept articles that mention upskilling, education, skills, etc.
              if (
                article &&
                !/upskilling|education|skill|learning|career|professional/i.test(
                  (article.title || "") + " " + (article.description || "") + " " + (article.content || "")
                )
              ) {
                article = null;
              }

              return {
                pair: [k1, k2] as [string, string],
                article
              };
            } catch {
              return {
                pair: [k1, k2] as [string, string],
                article: null
              };
            }
          })
        );
        setArticles(dedupeArticles(results));
      } catch (err) {
        setError("Could not fetch news articles. Please try again.");
      }
      setLoading(false);
    };
    if (pairs.length > 0) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programName, regions, demographics, audienceTypes, industry]);

  const handleContinue = () => {
    navigate("/ad-creatives", { 
      state: { programName, regions, targetPersona, articles } 
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-foreground">Relevant News Articles</h1>
            <p className="text-muted-foreground">
              {programName} • {regions.join(", ")} • {audienceTypes.join(", ")} • {industry}
            </p>
          </div>
        </div>

        {loading && <div>Loading articles...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        {!loading && !error && articles.length > 0 && articles.some(a => a.article) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles
              .filter(({ article }, idx) => article && !discarded.has(idx))
              .map(({ pair, article }, idx) => (
                <Card className="shadow-soft h-full flex flex-col" key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base font-bold leading-tight line-clamp-2">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {article.title}
                      </a>
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                      <span><b>Keywords:</b> {pair.filter(Boolean).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : ""}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="prose prose-gray max-w-none">
                      <p className="mb-2 text-foreground leading-relaxed">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="underline">
                          Read full article
                        </a>
                      </p>
                      <button
                        className="mt-2 text-xs text-red-600 underline"
                        onClick={() => setDiscarded(prev => new Set(prev).add(idx))}
                      >
                        Discard this article
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        <div className="flex items-center gap-4 justify-center mt-8">
          <Button
            onClick={handleContinue}
            className="flex items-center gap-2 bg-gradient-red hover:bg-education-red-dark"
            disabled={loading}
          >
            <CheckCircle className="h-4 w-4" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;
