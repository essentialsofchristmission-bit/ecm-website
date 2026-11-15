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

/**
 * The service groups for the pastor's messages, read only from the service named in the title.
 * Titles that name no service are kept apart rather than guessed.
 */
export const SERVICE_GROUPS = ["Sunday Service", "Wednesday Service", "Special services", "Service not stated"] as const;
export type ServiceGroup = (typeof SERVICE_GROUPS)[number];
export function serviceGroup(s: { service: string }): ServiceGroup {
  if (!s.service) return "Service not stated";
  if (/\bsunday\b/i.test(s.service)) return "Sunday Service";
  if (/\bwedne?s?day\b/i.test(s.service)) return "Wednesday Service";
  return "Special services";
}
