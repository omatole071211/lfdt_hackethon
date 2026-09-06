import type {
  Building,
  DayOfWeek,
  RecommendationQuery,
  RecommendationResult,
  RoomStatusResult,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch campus buildings list
 */
export async function fetchBuildings(): Promise<Building[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/buildings`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[API Service] Backend offline, using local engine fallback.', err);
    return null;
  }
}

/**
 * Fetch room availability evaluation from backend
 */
export async function fetchRoomAvailability(
  day: DayOfWeek,
  time: string,
  buildingId?: string,
  floor?: number | 'all',
  type?: string,
  query?: string
): Promise<RoomStatusResult[] | null> {
  try {
    const params = new URLSearchParams({
      day,
      time,
    });
    if (buildingId && buildingId !== 'all') params.append('buildingId', buildingId);
    if (floor !== undefined && floor !== 'all') params.append('floor', String(floor));
    if (type && type !== 'all') params.append('type', type);
    if (query) params.append('q', query);

    const res = await fetch(`${API_BASE_URL}/availability?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.statuses || null;
  } catch (err) {
    console.warn('[API Service] Backend query failed, using local engine calculation.', err);
    return null;
  }
}

/**
 * Fetch smart recommendations from backend
 */
export async function fetchRecommendations(
  query: RecommendationQuery,
  day: DayOfWeek,
  time: string
): Promise<RecommendationResult[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...query,
        day,
        time,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.recommendations || null;
  } catch (err) {
    console.warn('[API Service] Recommendation endpoint unreachable, falling back.', err);
    return null;
  }
}
