import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface VoiceFeedbackProps {
  message: string;
  onSpeechEnd?: () => void;
  autoSpeak?: boolean;
}

export function VoiceFeedback({ message, onSpeechEnd, autoSpeak = true }: VoiceFeedbackProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string) => {
    if (isMuted) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeechEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onSpeechEnd?.();
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (message && autoSpeak) {
      const timer = setTimeout(() => {
        speak(message);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [message, autoSpeak, isMuted]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleMute = () => {
    if (!isMuted && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  if (!message) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {isSpeaking ? "Speaking..." : isMuted ? "Muted" : "Voice Feedback"}
                </span>
              </div>
              <p className="text-base leading-relaxed" data-testid="text-voice-message">
                {message}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              data-testid="button-toggle-mute"
              className="shrink-0 hover-elevate active-elevate-2"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
          </div>

          {isSpeaking && (
            <div className="flex gap-1 items-end h-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
