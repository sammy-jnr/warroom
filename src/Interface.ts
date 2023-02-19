import { EmojiClickData } from "emoji-picker-react";
import {AxiosResponse} from "axios"

export interface Message {
  sender: string;
  message?: string;
  mediaType?: string;
  mediaUrl?: string;
  color:string
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

export interface ImageFullViewProps {
  currentImageSRC: string,
  setshowFullScreen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface PreviewImagesProps {
  setshowPreviewImagePage: React.Dispatch<React.SetStateAction<boolean>>,
  previewArray: string[],
  setpreviewArray: React.Dispatch<React.SetStateAction<string[]>>,
  sendMedia: () => void,
  setimageMessage: React.Dispatch<React.SetStateAction<string>>
}

export interface MainContextInterface {
  generalLoading: boolean,
  setgeneralLoading:React.Dispatch<React.SetStateAction<boolean>>
  popupEvent: string|null,
  setpopupEvent: React.Dispatch<React.SetStateAction<string | null>>
  joinRoom: (username: string, password: string, roomId: string) => Promise<AxiosResponse<any, any>>,
  setRoomCookie:(joinPassword: string, roomID: string) => void,
  cookies: {roomId?: any; joinPassword?: any;},
  createRoom: (username: string, password: string, roomName: string) => Promise<AxiosResponse<any, any>>,
  messages: Message[] | undefined,
  initializeSocketIO: () => void,
  connectRoomSocketIO: (room: string) => void
  sendMessageToDB: (message: string) => Promise<void> | undefined,
  setname: React.Dispatch<React.SetStateAction<string | undefined>>,
  name: string | undefined,
  numberOfNewMessages: number,
  setnotificationObj: React.Dispatch<React.SetStateAction<NotificationObjectInterface | null | undefined>>,
  notificationObj: NotificationObjectInterface | null | undefined,
  creator: string | null,
  members: string[] | undefined,
  leaveRoom: (roomId: string, joinPassword: string) => void,
  destroyRoom: (roomId: string, joinPassword: string) => void,
  getRoomFromDB: (roomId: string, joinPassword: string) => void,
  sendMediaToDB: (formData: FormData) => void,
  setcurrentImageFullView: React.Dispatch<React.SetStateAction<CurrentImageFullViewInterface | undefined>>,
  uploadImageLoading: boolean,
  setuploadImageLoading: React.Dispatch<React.SetStateAction<boolean>>,
  currentImageFullView: CurrentImageFullViewInterface | undefined,
  showRedDot: boolean,
  setshowRedDot: React.Dispatch<React.SetStateAction<boolean>>,
  sendReportMail: (name: string, email: string, message: string) => Promise<AxiosResponse<any, any>>,
  showPreviewImagePage: boolean,
  setshowPreviewImagePage: React.Dispatch<React.SetStateAction<boolean>>
}
