import { Button } from "@/components/ui/button";
import { Sparkles, Smile, MessageCircle, Shield } from "lucide-react";
import { getGreetingMessage } from "@shared/schema";

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

export function HeroSection({ onStartAnalysis }: HeroSectionProps) {
  const greeting = getGreetingMessage();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      
      {/* Animated circles */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative bg-primary/10 backdrop-blur-sm p-6 rounded-full border border-primary/20">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Face Analysis
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-greeting">
            {greeting}
          </p>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Experience real-time emotion detection powered by AI. Get instant insights into your mood with personalized voice feedback and emotional analysis.
        </p>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            size="lg"
            onClick={onStartAnalysis}
            data-testid="button-start-analysis"
            className="text-lg px-8 py-6 hover-elevate active-elevate-2 shadow-lg shadow-primary/20"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Start Analysis
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emotion-happy/20 text-emotion-happy mx-auto">
              <Smile className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Emotion Detection</h3>
            <p className="text-sm text-muted-foreground">
              Analyze 7 different emotions in real-time
            </p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Voice Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Receive personalized spoken messages
            </p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-chart-2/20 text-chart-2 mx-auto">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              All analysis happens on your device
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
