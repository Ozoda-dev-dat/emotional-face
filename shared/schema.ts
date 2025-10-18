import { z } from "zod";

// Emotion detection types
export const emotionTypes = ["happy", "sad", "angry", "neutral", "surprised", "fearful", "disgusted"] as const;

export type EmotionType = typeof emotionTypes[number];

export interface FaceAnalysis {
  age: number;
  gender: 'male' | 'female';
  emotion: EmotionType;
  emotionConfidence: number;
  expressions: {
    [key in EmotionType]?: number;
  };
}

export interface GreetingMessage {
  type: 'greeting' | 'emotion-response';
  emotion?: EmotionType;
  message: string;
}

// Voice message templates
export const emotionMessages: Record<EmotionType, string[]> = {
  happy: [
    "I'm glad to see that you are in a good mood today!",
    "Your smile is contagious! Keep spreading that positive energy!",
    "It's wonderful to see you so happy!"
  ],
  sad: [
    "Why are you sad? The afterlife is beautiful!",
    "I can see you're feeling down. Remember, brighter days are ahead.",
    "It's okay to feel sad sometimes. Things will get better."
  ],
  angry: [
    "I sense some frustration. Take a deep breath and let it go.",
    "Anger is natural, but don't let it control you.",
    "Whatever is bothering you, you have the strength to overcome it."
  ],
  neutral: [
    "You seem calm and composed today.",
    "A balanced state of mind is a powerful thing.",
    "Neutral energy can be peaceful energy."
  ],
  surprised: [
    "You look surprised! I hope it's a pleasant surprise!",
    "Life is full of unexpected moments, isn't it?"
  ],
  fearful: [
    "I can sense some worry. Everything will be alright.",
    "Don't be afraid. You're stronger than you think."
  ],
  disgusted: [
    "Something bothering you? Let's focus on the positive.",
    "Try to find something that brings you joy today."
  ]
};

// Greeting messages based on time of day
export function getGreetingMessage(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning! Welcome to Face Analysis. Let me see your beautiful face!";
  } else if (hour < 18) {
    return "Good afternoon! Ready to analyze your emotions?";
  } else {
    return "Good evening! Let's see how you're feeling today!";
  }
}

export function getEmotionMessage(emotion: EmotionType): string {
  const messages = emotionMessages[emotion];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Camera settings
export interface CameraSettings {
  isActive: boolean;
  deviceId?: string;
  facingMode: 'user' | 'environment';
}

// Analysis state
export interface AnalysisState {
  isAnalyzing: boolean;
  currentAnalysis: FaceAnalysis | null;
  error: string | null;
  lastSpokenEmotion: EmotionType | null;
  hasGreeted: boolean;
}
