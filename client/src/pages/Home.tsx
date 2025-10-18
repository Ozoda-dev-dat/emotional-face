import { useState, useRef, useCallback } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CameraFeed } from "@/components/CameraFeed";
import { EmotionDashboard } from "@/components/EmotionDashboard";
import { VoiceFeedback } from "@/components/VoiceFeedback";
import { HowItWorks } from "@/components/HowItWorks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { type FaceAnalysis, type EmotionType, getEmotionMessage, getGreetingMessage } from "@shared/schema";
import * as faceapi from 'face-api.js';

export default function Home() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const [lastEmotion, setLastEmotion] = useState<EmotionType | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  const loadModels = async () => {
    try {
      setModelError(null);
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to load AI models";
      console.error("Error loading models:", error);
      setModelError(errorMsg);
      setIsAnalyzing(false);
    }
  };

  const handleStreamReady = useCallback(async (stream: MediaStream, videoElement: HTMLVideoElement) => {
    // Clear any existing interval before starting a new one
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (!modelsLoaded) {
      await loadModels();
    }

    if (!hasGreeted) {
      setVoiceMessage(getGreetingMessage());
      setHasGreeted(true);
    }

    setIsAnalyzing(true);

    const detectFace = async () => {
      if (!videoElement || videoElement.paused || videoElement.ended) {
        return;
      }

      try {
        const detections = await faceapi
          .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        if (detections) {
          const expressions = detections.expressions;
          const dominantEmotion = getDominantEmotion(expressions);
          
          const faceAnalysis: FaceAnalysis = {
            age: detections.age,
            gender: detections.gender as 'male' | 'female',
            emotion: dominantEmotion,
            emotionConfidence: expressions[dominantEmotion] || 0,
            expressions: {
              happy: expressions.happy,
              sad: expressions.sad,
              angry: expressions.angry,
              neutral: expressions.neutral,
              surprised: expressions.surprised,
              fearful: expressions.fearful,
              disgusted: expressions.disgusted,
            }
          };

          setAnalysis(faceAnalysis);

          if (dominantEmotion !== lastEmotion && (expressions[dominantEmotion] || 0) > 0.5) {
            const message = getEmotionMessage(dominantEmotion);
            setVoiceMessage(message);
            setLastEmotion(dominantEmotion);
          }
        }
      } catch (error) {
        console.error("Detection error:", error);
      }
    };

    detectionIntervalRef.current = window.setInterval(detectFace, 1000);
  }, [modelsLoaded, hasGreeted, lastEmotion]);

  const getDominantEmotion = (expressions: faceapi.FaceExpressions): EmotionType => {
    const emotionMap: Array<[EmotionType, number]> = [
      ['happy', expressions.happy],
      ['sad', expressions.sad],
      ['angry', expressions.angry],
      ['neutral', expressions.neutral],
      ['surprised', expressions.surprised],
      ['fearful', expressions.fearful],
      ['disgusted', expressions.disgusted],
    ];

    emotionMap.sort((a, b) => b[1] - a[1]);
    return emotionMap[0][0];
  };

  const handleStreamError = (error: string) => {
    console.error("Stream error:", error);
    setIsAnalyzing(false);
  };

  const handleStartAnalysis = () => {
    setShowAnalysis(true);
  };

  const handleBackToHome = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    setShowAnalysis(false);
    setAnalysis(null);
    setIsAnalyzing(false);
    setHasGreeted(false);
    setLastEmotion(null);
    setVoiceMessage("");
  };

  if (!showAnalysis) {
    return (
      <div className="min-h-screen">
        <header className="absolute top-0 right-0 p-4 z-10">
          <ThemeToggle />
        </header>
        <HeroSection onStartAnalysis={handleStartAnalysis} />
        <HowItWorks />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            data-testid="button-back-home"
            className="hover-elevate active-elevate-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Face Analysis</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed
              onStreamReady={handleStreamReady}
              onStreamError={handleStreamError}
              isAnalyzing={isAnalyzing}
            />
            
            {modelError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load AI models: {modelError}. Please refresh the page to try again.
                </AlertDescription>
              </Alert>
            )}

            {voiceMessage && !modelError && (
              <VoiceFeedback 
                message={voiceMessage} 
                autoSpeak={true}
              />
            )}
          </div>

          {/* Analysis Dashboard - Takes up 1 column */}
          <div className="lg:col-span-1">
            <EmotionDashboard 
              analysis={analysis} 
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>All analysis is performed locally on your device. No data is sent to external servers.</p>
        </div>
      </footer>
    </div>
  );
}
