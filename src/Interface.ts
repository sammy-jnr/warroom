import { EmojiClickData } from "emoji-picker-react";

export interface Message {
  sender: string;
  message?: string;
  mediaType?: string;
  mediaUrl?: string;
}

export interface ResInterface {
  data: {
    roomId: string;
    joinPassword: string;
    username: string;
  };
}

export interface InputProps {
  inputRef: React.Ref<HTMLTextAreaElement> | null;
  setshowSelectEmojiPage: React.Dispatch<React.SetStateAction<boolean>>;
  clearInputField: () => void;
  setmessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setshowPreviewImagePage: React.Dispatch<React.SetStateAction<boolean>>;
  onNewFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filesRef: React.Ref<HTMLInputElement> | null;
}

export interface EmojiProps {
  setchoosenEmoji: React.Dispatch<
    React.SetStateAction<EmojiClickData | undefined>
  >;
}

export interface MenuProps {
  setshowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AuthContextProviderProps {
  children: React.ReactNode;
}
export interface NotificationObjectInterface {
  text: string;
  backgroundColor: string;
  status: boolean;
  time: number;
  fontSize: number;
}
export interface RoomInterface {
  creator: string;
  roomName: string;
  roomId: string;
  members: string[];
  messages: Message[];
  hash: string;
  joinPassword: string;
  date?: number;
}

export interface CurrentImageFullViewInterface {
  type: string;
  src: string;
  display: boolean;
}
