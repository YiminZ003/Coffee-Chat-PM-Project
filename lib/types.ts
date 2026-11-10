export type PersonType = "alumni" | "student";
/** Industries offered in onboarding, profile editing and the people filter. */
export const INDUSTRIES = ["Banking", "Consulting", "Finance", "Healthcare", "Marketing", "Retail", "Sustainability", "Technology"] as const;
export type Industry = (typeof INDUSTRIES)[number];
export type Profile = {
  id: string;
  name: string;
  email: string | null;
  type: PersonType;
  program: string;
  class_year: number;
  /** Usually one of INDUSTRIES; stays a string so older Supabase rows still load. */
  industry: string;
  role: string;
  interests: string[];
  chat_goal: string;
  open_to_chats: boolean;
  is_sample: boolean;
  avatar_tone?: string;
};
export type Suggestions = { reason: string; message: string; questions: string[]; mode: "ai" | "template" };
