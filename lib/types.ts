export type PersonType = "alumni" | "student";
export type Profile = {
  id: string;
  name: string;
  email: string | null;
  type: PersonType;
  program: string;
  class_year: number;
  industry: string;
  role: string;
  interests: string[];
  chat_goal: string;
  open_to_chats: boolean;
  is_sample: boolean;
  avatar_tone?: string;
};
export type Suggestions = { reason: string; message: string; questions: string[]; mode: "ai" | "template" };
