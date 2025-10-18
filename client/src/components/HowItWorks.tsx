import { Card, CardContent } from "@/components/ui/card";
import { Camera, Brain, MessageCircle } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Capture",
      description: "Allow camera access to capture your facial expressions in real-time"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Analyze",
      description: "AI analyzes your emotions, age, and facial expressions instantly"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Respond",
      description: "Receive personalized voice feedback based on your detected emotion"
    }
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to analyze your emotions and receive personalized feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
