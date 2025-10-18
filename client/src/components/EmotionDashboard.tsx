import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { type FaceAnalysis, type EmotionType } from "@shared/schema";
import { Smile, Frown, Angry, Meh, Zap, Skull, ThumbsDown } from "lucide-react";

interface EmotionDashboardProps {
  analysis: FaceAnalysis | null;
  isAnalyzing: boolean;
}

const emotionIcons: Record<EmotionType, React.ReactNode> = {
  happy: <Smile className="h-5 w-5" />,
  sad: <Frown className="h-5 w-5" />,
  angry: <Angry className="h-5 w-5" />,
  neutral: <Meh className="h-5 w-5" />,
  surprised: <Zap className="h-5 w-5" />,
  fearful: <Skull className="h-5 w-5" />,
  disgusted: <ThumbsDown className="h-5 w-5" />
};

const emotionLabels: Record<EmotionType, string> = {
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  neutral: "Neutral",
  surprised: "Surprised",
  fearful: "Fearful",
  disgusted: "Disgusted"
};

export function EmotionDashboard({ analysis, isAnalyzing }: EmotionDashboardProps) {
  if (!isAnalyzing && !analysis) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Start the camera to begin analysis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAnalyzing && !analysis) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Analyzing...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary Emotion Card */}
      <Card className="border-2" style={{
        borderColor: `var(--emotion-${analysis?.emotion})`,
        backgroundColor: `hsl(var(--card))`,
      }}>
        <CardHeader className="space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Current Emotion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div 
              className="p-4 rounded-xl flex items-center justify-center"
              style={{ 
                backgroundColor: `hsl(from var(--emotion-${analysis?.emotion}) h s l / 0.15)`,
                color: `var(--emotion-${analysis?.emotion})`
              }}
            >
              {analysis && emotionIcons[analysis.emotion]}
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold" data-testid="text-emotion">
                {analysis && emotionLabels[analysis.emotion]}
              </div>
              <div className="text-sm text-muted-foreground" data-testid="text-confidence">
                {analysis && `${Math.round(analysis.emotionConfidence * 100)}% confident`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Age & Gender Card */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimated Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-age">
              {analysis ? Math.round(analysis.age) : "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gender
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize" data-testid="text-gender">
              {analysis?.gender || "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Expressions Card */}
      <Card>
        <CardHeader className="space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Expression Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis && Object.entries(analysis.expressions)
            .sort(([, a], [, b]) => (b || 0) - (a || 0))
            .map(([emotion, value]) => (
              <div key={emotion} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-lg"
                      style={{ color: `var(--emotion-${emotion})` }}
                    >
                      {emotionIcons[emotion as EmotionType]}
                    </span>
                    <span className="font-medium">
                      {emotionLabels[emotion as EmotionType]}
                    </span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {Math.round((value || 0) * 100)}%
                  </Badge>
                </div>
                <Progress 
                  value={(value || 0) * 100} 
                  className="h-2"
                  style={{
                    // @ts-ignore
                    '--progress-background': `var(--emotion-${emotion})`
                  }}
                />
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
