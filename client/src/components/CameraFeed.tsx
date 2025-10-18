import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraFeedProps {
  onStreamReady: (stream: MediaStream, videoElement: HTMLVideoElement) => void;
  onStreamError: (error: string) => void;
  isAnalyzing: boolean;
}

export function CameraFeed({ onStreamReady, onStreamError, isAnalyzing }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setStream(mediaStream);
          if (videoRef.current) {
            onStreamReady(mediaStream, videoRef.current);
          }
        };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to access camera";
      setError(errorMsg);
      onStreamError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted flex items-center justify-center">
        {!stream && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Camera className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Camera Access Required</h3>
              <p className="text-muted-foreground max-w-md">
                We need access to your camera to analyze your facial expressions and emotions in real-time.
              </p>
            </div>
            <Button
              onClick={startCamera}
              disabled={isLoading}
              size="lg"
              data-testid="button-start-camera"
              className="hover-elevate active-elevate-2"
            >
              {isLoading ? "Starting..." : "Start Camera"}
            </Button>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={startCamera}
              variant="outline"
              data-testid="button-retry-camera"
              className="hover-elevate active-elevate-2"
            >
              Try Again
            </Button>
          </div>
        )}

        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${stream ? "block" : "hidden"}`}
          autoPlay
          playsInline
          muted
        />

        {stream && (
          <>
            <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md ${
              isAnalyzing 
                ? "bg-primary/20 border border-primary/30" 
                : "bg-background/20 border border-border/30"
            }`}>
              <div className={`w-2 h-2 rounded-full ${isAnalyzing ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-sm font-medium">
                {isAnalyzing ? "Analyzing" : "Ready"}
              </span>
            </div>

            <Button
              onClick={stopCamera}
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 backdrop-blur-md bg-background/80 hover-elevate active-elevate-2"
              data-testid="button-stop-camera"
            >
              <CameraOff className="h-4 w-4" />
              <span className="sr-only">Stop Camera</span>
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
