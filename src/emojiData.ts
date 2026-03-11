export interface EmojiEntry {
  emoji: string
  keywords: string[]
}

export const EMOJI_DATA: EmojiEntry[] = [
  // Fitness & Sports
  { emoji: '💪', keywords: ['muscle', 'strong', 'arm', 'fitness', 'gym', 'exercise', 'strength'] },
  { emoji: '🏃', keywords: ['run', 'running', 'jog', 'sprint', 'exercise', 'fitness'] },
  { emoji: '🚴', keywords: ['bike', 'bicycle', 'cycling', 'ride', 'exercise'] },
  { emoji: '🏊', keywords: ['swim', 'swimming', 'pool', 'water', 'exercise'] },
  { emoji: '🧘', keywords: ['yoga', 'meditate', 'meditation', 'zen', 'calm', 'stretch'] },
  { emoji: '⚽', keywords: ['soccer', 'football', 'ball', 'sport', 'kick'] },
  { emoji: '🏀', keywords: ['basketball', 'ball', 'sport', 'hoop'] },
  { emoji: '🎾', keywords: ['tennis', 'ball', 'sport', 'racket'] },
  { emoji: '🏋️', keywords: ['weightlifting', 'gym', 'weights', 'exercise', 'lift'] },
  { emoji: '⛳', keywords: ['golf', 'sport', 'hole'] },
  { emoji: '🥊', keywords: ['boxing', 'fight', 'punch', 'sport'] },
  { emoji: '🎯', keywords: ['target', 'goal', 'dart', 'bullseye', 'aim'] },
  { emoji: '🏆', keywords: ['trophy', 'win', 'champion', 'award', 'first'] },
  { emoji: '🥇', keywords: ['medal', 'gold', 'first', 'win', 'award'] },

  // Food & Drink
  { emoji: '☕', keywords: ['coffee', 'cup', 'drink', 'morning', 'cafe', 'tea', 'hot'] },
  { emoji: '🍵', keywords: ['tea', 'green', 'drink', 'cup', 'hot'] },
  { emoji: '🥤', keywords: ['drink', 'soda', 'cup', 'beverage', 'juice'] },
  { emoji: '🍺', keywords: ['beer', 'drink', 'alcohol', 'pub', 'bar'] },
  { emoji: '🍷', keywords: ['wine', 'drink', 'alcohol', 'glass', 'red'] },
  { emoji: '💧', keywords: ['water', 'drop', 'drink', 'hydrate', 'liquid'] },
  { emoji: '🍎', keywords: ['apple', 'fruit', 'food', 'healthy', 'red'] },
  { emoji: '🥦', keywords: ['broccoli', 'vegetable', 'healthy', 'food', 'green'] },
  { emoji: '🥗', keywords: ['salad', 'healthy', 'food', 'vegetable', 'green'] },
  { emoji: '🍕', keywords: ['pizza', 'food', 'slice', 'Italian'] },
  { emoji: '🍔', keywords: ['burger', 'hamburger', 'food', 'fast food'] },
  { emoji: '🍳', keywords: ['egg', 'cooking', 'breakfast', 'food', 'fry'] },
  { emoji: '🥩', keywords: ['meat', 'steak', 'food', 'protein'] },
  { emoji: '🍰', keywords: ['cake', 'dessert', 'sweet', 'food', 'birthday'] },
  { emoji: '🍩', keywords: ['donut', 'doughnut', 'sweet', 'dessert', 'food'] },
  { emoji: '🍪', keywords: ['cookie', 'sweet', 'dessert', 'food', 'snack'] },

  // Health & Wellness
  { emoji: '💊', keywords: ['pill', 'medicine', 'medication', 'health', 'vitamin'] },
  { emoji: '🩺', keywords: ['doctor', 'health', 'medical', 'stethoscope'] },
  { emoji: '😴', keywords: ['sleep', 'rest', 'tired', 'nap', 'zzz', 'bed'] },
  { emoji: '🛌', keywords: ['bed', 'sleep', 'rest', 'nap'] },
  { emoji: '🧴', keywords: ['lotion', 'skincare', 'cream', 'sunscreen'] },
  { emoji: '🪥', keywords: ['toothbrush', 'teeth', 'dental', 'brush', 'hygiene'] },
  { emoji: '❤️', keywords: ['heart', 'love', 'health', 'red'] },
  { emoji: '🧠', keywords: ['brain', 'think', 'mind', 'smart', 'mental'] },

  // Work & Productivity
  { emoji: '📝', keywords: ['note', 'write', 'memo', 'pencil', 'journal', 'log'] },
  { emoji: '📖', keywords: ['book', 'read', 'reading', 'study', 'open'] },
  { emoji: '📚', keywords: ['books', 'read', 'study', 'library', 'learn'] },
  { emoji: '💻', keywords: ['laptop', 'computer', 'code', 'work', 'programming'] },
  { emoji: '📧', keywords: ['email', 'mail', 'message', 'inbox'] },
  { emoji: '📞', keywords: ['phone', 'call', 'telephone', 'ring'] },
  { emoji: '📅', keywords: ['calendar', 'date', 'schedule', 'plan', 'day'] },
  { emoji: '⏰', keywords: ['alarm', 'clock', 'time', 'wake', 'morning'] },
  { emoji: '✅', keywords: ['check', 'done', 'complete', 'task', 'yes', 'todo'] },
  { emoji: '🎓', keywords: ['graduate', 'school', 'education', 'learn', 'study'] },
  { emoji: '✏️', keywords: ['pencil', 'write', 'draw', 'edit'] },
  { emoji: '📊', keywords: ['chart', 'graph', 'data', 'stats', 'analytics'] },
  { emoji: '💰', keywords: ['money', 'dollar', 'cash', 'save', 'finance', 'bag'] },

  // Nature & Weather
  { emoji: '🌞', keywords: ['sun', 'sunny', 'bright', 'weather', 'morning'] },
  { emoji: '🌧️', keywords: ['rain', 'rainy', 'weather', 'cloud', 'wet'] },
  { emoji: '🌿', keywords: ['plant', 'herb', 'green', 'nature', 'leaf'] },
  { emoji: '🌸', keywords: ['flower', 'blossom', 'cherry', 'spring', 'pink'] },
  { emoji: '🌲', keywords: ['tree', 'pine', 'evergreen', 'nature', 'forest'] },
  { emoji: '🐕', keywords: ['dog', 'pet', 'puppy', 'walk', 'animal'] },
  { emoji: '🐈', keywords: ['cat', 'pet', 'kitten', 'animal'] },

  // Activities & Hobbies
  { emoji: '🎵', keywords: ['music', 'note', 'song', 'listen', 'play'] },
  { emoji: '🎸', keywords: ['guitar', 'music', 'play', 'rock', 'instrument'] },
  { emoji: '🎮', keywords: ['game', 'gaming', 'video', 'play', 'controller'] },
  { emoji: '🎨', keywords: ['art', 'paint', 'draw', 'palette', 'creative'] },
  { emoji: '📷', keywords: ['camera', 'photo', 'picture', 'photography'] },
  { emoji: '🧹', keywords: ['broom', 'clean', 'sweep', 'chore', 'house'] },
  { emoji: '🧺', keywords: ['laundry', 'basket', 'clothes', 'wash', 'chore'] },
  { emoji: '🚗', keywords: ['car', 'drive', 'commute', 'travel', 'vehicle'] },
  { emoji: '✈️', keywords: ['plane', 'airplane', 'flight', 'travel', 'trip'] },
  { emoji: '🛒', keywords: ['shopping', 'cart', 'grocery', 'buy', 'store'] },

  // Emotions & Social
  { emoji: '😊', keywords: ['smile', 'happy', 'joy', 'face', 'glad'] },
  { emoji: '😂', keywords: ['laugh', 'funny', 'lol', 'joy', 'tears'] },
  { emoji: '🤝', keywords: ['handshake', 'meet', 'deal', 'agree', 'partner'] },
  { emoji: '👋', keywords: ['wave', 'hello', 'hi', 'bye', 'greet'] },
  { emoji: '🙏', keywords: ['pray', 'thanks', 'grateful', 'please', 'hope'] },
  { emoji: '🎉', keywords: ['party', 'celebrate', 'confetti', 'tada'] },
  { emoji: '⭐', keywords: ['star', 'favorite', 'shine', 'rating', 'best'] },
  { emoji: '🔥', keywords: ['fire', 'hot', 'streak', 'flame', 'lit'] },
  { emoji: '⚡', keywords: ['lightning', 'bolt', 'energy', 'power', 'fast', 'electric'] },
  { emoji: '🚀', keywords: ['rocket', 'launch', 'fast', 'speed', 'ship'] },

  // Misc
  { emoji: '🔔', keywords: ['bell', 'notification', 'alert', 'ring', 'remind'] },
  { emoji: '🗓️', keywords: ['calendar', 'schedule', 'date', 'plan'] },
  { emoji: '📌', keywords: ['pin', 'pushpin', 'location', 'mark', 'important'] },
  { emoji: '🏠', keywords: ['house', 'home', 'building'] },
  { emoji: '🧊', keywords: ['ice', 'cold', 'freeze', 'cube'] },
  { emoji: '🎁', keywords: ['gift', 'present', 'birthday', 'wrap'] },
  { emoji: '🔑', keywords: ['key', 'lock', 'unlock', 'password', 'security'] },
  { emoji: '🛡️', keywords: ['shield', 'protect', 'defense', 'security', 'safe'] },
  { emoji: '♻️', keywords: ['recycle', 'green', 'environment', 'reuse'] },
  { emoji: '🚿', keywords: ['shower', 'bath', 'wash', 'clean', 'water'] },
]

export function searchEmoji(query: string): EmojiEntry[] {
  if (!query.trim()) return EMOJI_DATA.slice(0, 20)
  const q = query.toLowerCase().trim()
  return EMOJI_DATA.filter(entry =>
    entry.keywords.some(kw => kw.startsWith(q))
  ).slice(0, 20)
}
