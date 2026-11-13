/* Phone chat scripts. Copy from the client's notes (2026-11-13). */

export type Card = "posture" | "future" | "room" | "form";

export type Step =
  | { t: "coach"; text: string; replies?: string[]; tag?: string }
  | { t: "you"; text: string }
  | { t: "note"; text: string }
  | { t: "card"; card: Card };

export const HERO: Step[] = [
  { t: "coach", text: "Good morning! Ready to move?" },
  { t: "you", text: "Honestly? Not feeling it." },
  { t: "coach", text: "That’s fair. Let’s start small. Ten seconds, shoulders down, one deep breath." },
  { t: "you", text: "Done." },
  {
    t: "coach",
    text: "See? You showed up. That’s the hard part. Now give me ten heel raises. I’ll count, you stand tall. You’ve got more in you than you think.",
    tag: "Posture today · better than Monday",
  },
];

export type Signal = { icon: "watch" | "calendar" | "camera" | "scan" | "pin"; source: string; lines: [string, string] };

export type Scenario = {
  id: string;
  time: string;
  signal: Signal;
  title: string;
  trigger: string;
  mode: string;
  script: Step[];
  tough?: Step[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "charged",
    time: "06:40",
    signal: { icon: "watch", source: "Watch", lines: ["Sleep: deep", "Recovery: strong"] },
    title: "Charged and ready",
    trigger: "Your watch shows good sleep and strong recovery.",
    mode: "Hype",
    script: [
      { t: "coach", text: "Good morning! What are you up to today?" },
      { t: "you", text: "I’ve only got about 30 minutes." },
      {
        t: "coach",
        text: "That’s plenty! Let’s squeeze in a 20-minute ab set. Won’t take us longer than that.",
        replies: ["Quick run", "20-minute ab set", "Maybe later"],
      },
      { t: "you", text: "Ab set. Let’s do it." },
      { t: "coach", text: "Let’s gooooo! Grab your mat. I’ll start your playlist and I’ll count with you." },
    ],
  },
  {
    id: "tired",
    time: "07:15",
    signal: { icon: "watch", source: "Watch + check-in", lines: ["Sleep: short night", "Feeling: tired"] },
    title: "Running on empty",
    trigger: "Daily check-in after a short night.",
    mode: "Safe space",
    script: [
      { t: "coach", text: "Hi, just checking in. How are you feeling today?" },
      { t: "you", text: "Honestly? Pretty tired." },
      {
        t: "coach",
        text: "Thanks for telling me. Your watch says it was a short night, too. Let’s go gentler today. How about 15 minutes of Pilates, or some slow yoga stretches?",
      },
      { t: "you", text: "Yoga stretches sound good." },
      { t: "coach", text: "Perfect. Easy pace, no rush. We’ll open up your hips and shoulders. Same goal, softer route. I’m right here with you." },
    ],
  },
  {
    id: "slammed",
    time: "09:30",
    signal: { icon: "calendar", source: "Calendar", lines: ["Back-to-back meetings", "Workout slot: gone"] },
    title: "Slammed day",
    trigger: "No time for a workout.",
    mode: "Supportive",
    script: [
      { t: "you", text: "Slammed today. Don’t think I can work out." },
      {
        t: "coach",
        text: "Totally fair. Big days happen. What if we skip the workout and do two minutes at your desk? Shoulder rolls and a hip stretch. It keeps your streak going and your back happy.",
      },
      { t: "you", text: "Two minutes I can do." },
      { t: "coach", text: "That’s all I need. Sit tall, shoulders down. Ready when you are." },
      { t: "note", text: "Two minutes later" },
      { t: "coach", text: "Done! Nice work. Tonight’s your call: an easy walk, or nothing at all." },
    ],
  },
  {
    id: "form",
    time: "18:10",
    signal: { icon: "camera", source: "Camera", lines: ["Live form tracking", "Wall angels, set 1"] },
    title: "Live form check",
    trigger: "Mid-workout, camera on.",
    mode: "Supportive",
    script: [
      { t: "coach", text: "Camera’s on. Show me your first set of wall angels." },
      { t: "card", card: "form" },
      { t: "coach", text: "Strong start! Your left shoulder’s creeping up a little. Let it melt down." },
      { t: "coach", text: "There it is. That’s the one. Four more, I’ve got you." },
      { t: "you", text: "That was hard." },
      { t: "coach", text: "It was, and your form got cleaner every rep. That’s real progress." },
    ],
    tough: [
      { t: "coach", text: "Camera’s on. Wall angels. Show me what you’ve got." },
      { t: "card", card: "form" },
      { t: "coach", text: "Left shoulder’s hiking up. Drop it. You know how." },
      { t: "coach", text: "Better! Don’t you quit on me now. Four more, and make them clean." },
      { t: "you", text: "That was hard." },
      { t: "coach", text: "Good. Hard is where it changes. And that last rep? Your cleanest yet." },
    ],
  },
  {
    id: "rescan",
    time: "Day 28",
    signal: { icon: "scan", source: "Body scan", lines: ["Four weeks in", "Re-scan due"] },
    title: "Four-week re-scan",
    trigger: "Your scheduled check-in.",
    mode: "Supportive",
    script: [
      { t: "coach", text: "It’s been four weeks! Ready for a quick re-scan? It only takes a couple of minutes." },
      { t: "you", text: "Sure." },
      { t: "note", text: "Scan runs" },
      { t: "coach", text: "Okay, I’m excited about this one. Your shoulders are more level, and your head’s sitting back over your spine. Here’s your updated future self." },
      { t: "card", card: "future" },
      { t: "coach", text: "You’re a little ahead of schedule, so I’m moving your goal date up. For the next two weeks, let’s do less stretching and more back strength. Sound good?" },
      { t: "you", text: "Sounds great." },
    ],
    tough: [
      { t: "coach", text: "Four weeks in. Time for the scoreboard. Re-scan, and let’s see what you’ve earned." },
      { t: "you", text: "Sure." },
      { t: "note", text: "Scan runs" },
      { t: "coach", text: "Look at that. Shoulders more level, head back over your spine. That’s not luck, that’s you showing up. Here’s your updated future self." },
      { t: "card", card: "future" },
      { t: "coach", text: "You’re ahead of schedule, so I’m moving your goal date up and raising the bar. Less stretching, more back strength for the next two weeks. You ready?" },
      { t: "you", text: "Ready." },
      { t: "coach", text: "That’s what I like to hear." },
    ],
  },
  {
    id: "hotel",
    time: "21:05",
    signal: { icon: "pin", source: "Location", lines: ["Hotel, no gym", "Sam is free"] },
    title: "Hotel room, with a buddy",
    trigger: "Travelling, no gym.",
    mode: "Supportive",
    script: [
      { t: "you", text: "I’m in a hotel with no gym. Help?" },
      { t: "coach", text: "On it. Pan your camera around the room for me." },
      { t: "card", card: "room" },
      { t: "coach", text: "I see a chair, a towel and some open floor. That’s a full workout. Also, Sam’s free right now. Want to train together?" },
      { t: "you", text: "Yes!" },
      { t: "coach", text: "Sam’s coach and I are lining up one session. You’ll train side by side, live." },
    ],
    tough: [
      { t: "you", text: "I’m in a hotel with no gym. Help?" },
      { t: "coach", text: "No gym? Doesn’t matter. Pan your camera around the room." },
      { t: "card", card: "room" },
      { t: "coach", text: "A chair, a towel and some floor. That’s a workout. And Sam’s free right now. Train together and you’ll keep each other honest." },
      { t: "you", text: "Let’s go." },
      { t: "coach", text: "Sam’s coach and I are lining up one session. Side by side, live. Show up." },
    ],
  },
];
