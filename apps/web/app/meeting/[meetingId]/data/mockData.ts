export const DEMO_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

export const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&w=400&q=70",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&w=400&q=70",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&w=400&q=70",
  "https://images.unsplash.com/photo-1506863530036-1efeddceb993?crop=entropy&cs=srgb&fm=jpg&w=400&q=70",
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?crop=entropy&cs=srgb&fm=jpg&w=400&q=70",
];

const HUES = [210, 172, 42, 340, 265, 12, 138, 292, 195, 55, 320, 155];

const NAMES = [
  "Aria Chen",
  "Marcus Wells",
  "Priya Patel",
  "Diego Ramirez",
  "Jamie Kim",
  "Nikolai Volkov",
  "Sofia Rossi",
  "Kenji Tanaka",
  "Amara Okonkwo",
  "Elena Fischer",
  "Oliver Bennett",
  "Yuki Sato",
  "Rashid Ahmed",
  "Isabella Costa",
  "Lin Wei",
  "Fatima Hassan",
  "Lucas Silva",
  "Zoe Miller",
  "Ravi Kumar",
  "Anya Petrov",
  "Hugo Laurent",
  "Mei Tanaka",
  "Jonah Byrd",
  "Naomi Field",
];

let nextId = 1;

export function createParticipant(index: number) {
  const name = NAMES[index % NAMES.length];

  const initials = name!
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: `p-${nextId++}`,
    name,
    initials,
    videoSrc: DEMO_VIDEOS[index % DEMO_VIDEOS.length],
    avatar: index < AVATAR_URLS.length ? AVATAR_URLS[index] : null,
    hue: HUES[index % HUES.length],
    micOn: Math.random() > 0.35,
    cameraOn: Math.random() > 0.15,
    speaking: false,
    handRaised: false,
    isSelf: false,
  };
}

export function seedParticipants(count = 6) {
  nextId = 1;
  const list = [];
  for (let i = 0; i < count; i++) list.push(createParticipant(i));
  list[0]!.name = "You";
  list[0]!.initials = "YO";
  list[0]!.isSelf = true;
  list[0]!.micOn = true;
  list[0]!.cameraOn = true;
  return list;
}

export const REACTIONS = ["❤️", "👍", "👏", "🎉", "😂", "🙌", "🔥", "✨"];

export const MOCK_CHAT_SEED = [
  {
    id: "m1",
    from: "Aria Chen",
    text: "Morning everyone, glad we could all make it 👋",
    time: "10:02",
  },
  {
    id: "m2",
    from: "Marcus Wells",
    text: "Sharing my screen in a sec — the Q3 pipeline slide.",
    time: "10:03",
  },
  {
    id: "m3",
    from: "Priya Patel",
    text: "Quick note: I have a hard stop at 10:45.",
    time: "10:04",
  },
];
