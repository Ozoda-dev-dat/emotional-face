# Face Analysis App - Design Guidelines

## Design Approach
**Hybrid Approach**: Drawing from modern AI tools (Linear's clean interface + Notion's approachability) with Material Design principles for the technical components. The design balances professional capability with emotional warmth to match the app's dual nature of technical analysis and empathetic responses.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: 220 25% 8% (deep slate)
- Surface: 220 20% 12% (elevated panels)
- Primary: 195 85% 60% (calming cyan-blue)
- Success/Happy: 142 70% 55% (soft green)
- Warning/Neutral: 35 85% 65% (warm amber)
- Error/Sad: 345 75% 60% (gentle red-pink)
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 65%

**Light Mode**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 195 75% 45%
- Emotion colors adjusted for light background contrast

### B. Typography
- **Headings**: Inter (600-700 weight)
  - H1: text-4xl md:text-5xl
  - H2: text-2xl md:text-3xl
  - H3: text-xl md:text-2xl
- **Body**: Inter (400-500 weight)
  - Base: text-base
  - Small: text-sm
- **Mono** (Analysis data): JetBrains Mono (400 weight)

### C. Layout System
**Spacing Units**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Consistent padding: p-6 md:p-8 for cards
- Section spacing: py-12 md:py-16
- Grid gaps: gap-4 md:gap-6

### D. Component Library

**Camera Feed Interface**
- Large centered video preview with rounded-2xl border
- Aspect ratio 16:9 or 4:3 container with object-cover
- Subtle glow effect around active camera feed using primary color
- Permission request overlay with clear messaging
- Status indicator (red dot = recording, green = active analysis)

**Analysis Dashboard**
- Real-time metrics displayed in grid layout (2 columns mobile, 4 columns desktop)
- Each metric card: dark surface, rounded-xl, p-6
- Large numeric/text display for age estimate
- Emoji + text for emotion state with matching color coding
- Confidence percentage shown subtly below main values
- Smooth transitions between states (transition-all duration-300)

**Voice Feedback Panel**
- Speech bubble design emerging from bottom or side
- Animated text display synced with audio playback
- Volume indicator visualization (subtle wave animation)
- Mute/unmute toggle easily accessible
- Text display of spoken message for accessibility

**Control Panel**
- Start/Stop Analysis: Large primary button with icon
- Settings: Compact icon buttons for camera selection, audio preferences
- Privacy toggle: Clear on/off state for data storage preferences
- All controls use consistent sizing (h-12 for primary, h-10 for secondary)

**Greeting Section** 
- Welcome message prominently displayed on initial load
- Friendly animation on page entry (fade-in + slight scale)
- Personalization options (user can input name for personalized greetings)
- Time-based greetings (Good morning/afternoon/evening)

**Navigation**
- Minimal top bar: Logo left, settings/help icons right
- Mobile: Hamburger menu with slide-out drawer
- Sticky positioning on scroll

### E. Interaction Patterns
- Camera activation: Smooth fade-in with permission request
- Analysis results: Gentle pulse effect on emotion state change
- Voice playback: Subtle glow around feedback panel during speech
- Loading states: Skeleton screens for analysis cards
- Error states: Clear messaging with retry actions

## Layout Structure

**Single-Page Application Flow**:
1. **Hero/Welcome Section** (100vh)
   - Centered greeting message
   - Large "Start Analysis" CTA button
   - Brief explanation text (max-w-2xl centered)
   - Subtle abstract gradient background (primary color, very low opacity)

2. **Camera + Analysis Section** (min-h-screen, py-16)
   - Two-column layout (desktop): Video feed left (60%), Analysis right (40%)
   - Mobile: Stacked (video top, analysis below)
   - Container max-w-7xl

3. **How It Works** (optional, py-16)
   - 3-column grid explaining: Capture → Analyze → Respond
   - Icon + title + brief description per step
   - Light background contrast section

4. **Footer** (compact, py-8)
   - Privacy policy link
   - Data handling transparency
   - Technical credits

## Images
- **Hero Background**: Abstract, soft-focused imagery of diverse faces showing various emotions (blurred for privacy, artistic treatment). Overlay with dark gradient for text readability.
- **How It Works Icons**: Use Heroicons or Material Icons for camera, brain/analysis, and speech-bubble icons
- **No additional photography needed** - the live camera feed is the primary visual element

## Accessibility & Privacy
- High contrast ratios (WCAG AAA where possible)
- Camera permission clearly explained before request
- Audio descriptions for visual analysis results
- Keyboard navigation for all controls
- Clear data retention policies visible
- Option to disable voice entirely for quiet environments

## Technical Considerations
- Use `react-webcam` or browser MediaDevices API for camera access
- Web Speech API for voice synthesis
- Consider TensorFlow.js with Face-API for client-side face analysis
- Smooth 60fps animation targets
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)