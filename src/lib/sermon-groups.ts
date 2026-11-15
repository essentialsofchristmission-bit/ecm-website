// The fixed lists behind the Sermons page. Kept in their own small file so the page's
// filters can use them without loading every saved video.

/** The "role" values used in content/preachers.json. */
export const ROLES = ["Resident Pastor", "ECM Leadership", "Guest Preacher"] as const;
export type Role = (typeof ROLES)[number];

/** The tabs on the Sermons page. Every video is in exactly one. */
export const CATEGORIES = ["Sermons", "ECM Leadership", "Guest Preachers", "Forum Discussions", "Prayer Meetings", "Outreach"] as const;
export type Category = (typeof CATEGORIES)[number];

const KIND: Partial<Record<Category, string>> = { "Prayer Meetings": "Prayer Meeting", "Forum Discussions": "Forum Discussion", Outreach: "Outreach" };

/**
 * What kind of video this is, from its content: the meeting type, else the service from the title
 * (Sunday Service, Wednesday Service, Easter Service...), else "Sermon".
 */
export function sermonKind(s: { category: Category; service: string }) {
  return KIND[s.category] ?? (s.service || "Sermon");
}
