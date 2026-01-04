
export enum Vibe {
  LOVE = 'LOVE',
  PROPOSE = 'PROPOSE',
  SORRY = 'SORRY',
  FRIEND = 'FRIEND',
  BIRTHDAY = 'BIRTHDAY'
}

export type View = 'HOME' | 'FORM' | 'SURPRISE';

export interface SurpriseData {
  vibe: Vibe;
  recipientName: string;
  senderName: string;
  message: string;
}
