export const TABS = ["myynti", "lahjoitus", "kierrätys", "kunnostus"] as const;
export type TabType = (typeof TABS)[number];

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export interface ChatState {
  messages: Record<TabType, ChatMessage[]>;
  showInput: Record<TabType, boolean>;
}
