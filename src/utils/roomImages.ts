import type { Room } from "../types/api";

const roomImageFallbacks: Record<string, string> = {
  "Deluxe Ocean View":
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
  "Executive Suites":
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85",
  "Standard Rooms":
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
};

export function getRoomImage(room: Room): string {
  return room.images?.[0] || roomImageFallbacks[room.name] || roomImageFallbacks["Standard Rooms"];
}
