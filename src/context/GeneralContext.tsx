import {createContext, useEffect, useState} from "react"
import axios from "axios"
import {AxiosResponse} from "axios"
import { useCookies } from "react-cookie";
import {io} from "socket.io-client"
import { 
  Message, 
  AuthContextProviderProps, 
  NotificationObjectInterface, 
  RoomInterface, 
  CurrentImageFullViewInterface 
} from "../Interface"



interface MainContextInterface {
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
  sendMediaToDB: (formData: FormData, message: string) => void,
  setcurrentImageFullView: React.Dispatch<React.SetStateAction<CurrentImageFullViewInterface | undefined>>,
  currentImageFullView: CurrentImageFullViewInterface | undefined
}



export const MainContext = createContext<MainContextInterface>({} as MainContextInterface)

export function MainProvider ({children}:AuthContextProviderProps){

  const [cookies, setCookie, removeCookie] = useCookies(["roomId","joinPassword"]);
  const [generalLoading, setgeneralLoading] = useState<boolean>(false);
  const [popupEvent, setpopupEvent] = useState<string|null>("");
  const [messages, setmessages] = useState<Message[]|undefined>();
  const [members, setmembers] = useState<string[]|undefined>();
  const [name, setname] = useState<string|undefined>();
  const [numberOfNewMessages, setnumberOfNewMessages] = useState<number>(0);
  const [creator, setcreator] = useState<string|null>(null);
  const [notificationObj, setnotificationObj] = useState<NotificationObjectInterface|null>();
  const [currentImageFullView, setcurrentImageFullView] = useState<CurrentImageFullViewInterface>();

  
  const socket = io("http://localhost:5000")
  
  const initializeSocketIO = ()=>{
    socket.on("connect",()=>{
    console.log(socket.id)
    })
  }

  useEffect(()=>{
    if(!cookies.roomId)return;
    getRoomFromDB(cookies.roomId, cookies.joinPassword)
    initializeSocketIO()
    connectRoomSocketIO(cookies.roomId)
    const name = localStorage.getItem("username")
    if(name){
      setname(name)
    }
  },[])

  const connectRoomSocketIO = (room:string) => {
    socket.emit("joinRoom", room,(message:Message[])=> {
      setmessages(message)
    })
  }

  // this makes all users in that room fetch an updated array of the messages after a message is sent
  const sendMessageSocketIO = (roomId:string) => {
    socket.emit("sendMessage",roomId)
  }

  socket.on("updateMessage", (message:Message[])=>{
    setmessages(message)
    setnumberOfNewMessages(prev => prev +=1)
  })
  socket.on("startDestruction", ()=>{
    removeCookie("roomId",{path:'/'})
    removeCookie("joinPassword",{path:'/'})
    window.location.reload()
  })


  const joinRoom = (username:string, password:string, roomId:string) => {
    return axios({
      method: "post",
      data: {
        username,
        password,
        roomId
      },
      withCredentials: true,
      url: "http://localhost:5000/joinRoom",
    })
  }

  const createRoom = (username:string, password:string, roomName:string) => {
    return axios({
      method: "post",
      data: {
        username,
        password,
        roomName,
      },
      withCredentials: true,
      url: "http://localhost:5000/createRoom",
    })
  }

  const setRoomCookie = (joinPassword:string, roomId:string) => {
    const date = new Date();
    date.setTime(date.getTime() + 1000 * 60 * 60 * 12);

    setCookie("roomId", roomId, {
      path: "/",
      expires: date,
    });
    setCookie("joinPassword", joinPassword, {
      path: "/",
      expires: date,
    });
  };

  const sendMessageToDB = (message:string) => {
    if(message.length < 1)return
    const roomId = cookies.roomId
    const joinPassword = cookies.joinPassword
    if(!roomId || !name) return;
    const username = name
    return axios({
      method: "post",
      data: {
        message:{
          sender: username,
          message: message
        },
        roomId: roomId,
        joinPassword: joinPassword
      },
      withCredentials: true,
      url: "http://localhost:5000/sendMessage",
    })
    .then((res)=>{
      console.log(res.data)
      res.data && setmessages(res.data);
      console.log(res.data)
      sendMessageSocketIO(roomId)
    })
    .catch(err => console.log(err))
  }

  const getRoomFromDB = (roomId:string, joinPassword:string) => {
    axios({
      method: "post",
      data:{
        roomId,
        joinPassword
      },
      url: "http://localhost:5000/getRoom",
      withCredentials: true
    })
    .then((res)=>{
      if(!res.data){
        console.error("No data")
        return
      }
      const room:RoomInterface = res.data.room
      setmessages(room.messages)
      setmembers(room.members)
      setcreator(room.creator)
    })
  }

  const leaveRoom = (roomId:string, joinPassword:string) => {
    if(!name)return
    axios({
      withCredentials: true,
      url: "http://localhost:5000/leaveRoom",
      method: "post",
      data:{
        roomId,
        joinPassword,
        username: name
      }
    })
    .then(()=>{
      removeCookie("roomId",{path:'/'})
      removeCookie("joinPassword",{path:'/'})
      window.location.reload()
    })
    .catch(err => console.log(err))
  }

  const destroyRoom = (roomId:string, joinPassword:string) => {
    if(!name)return
    axios({
      withCredentials: true,
      url: "http://localhost:5000/destroyRoom",
      method: "post",
      data:{
        roomId,
        joinPassword,
      }
    })
    .then(()=>{
      socket.emit("destroyRoom",roomId)
      removeCookie("roomId",{path:'/'})
      removeCookie("joinPassword",{path:'/'})
      window.location.reload()
    })
    .catch(err => console.log(err))
  }

  const sendMediaToDB = (formData:FormData, message:string) => {
    axios({
      method: "post",
      withCredentials: true,
      url: "http://localhost:5000/sendMedia",
      data:formData
    })
    .then((res) => {
      if(!res.data)return
      console.log(res.data)
      setmessages(res.data)
      sendMessageSocketIO(cookies.roomId)
    })
    .catch(err => console.log(err))
  }
  
  return(
    <MainContext.Provider value={{
      generalLoading,
      setgeneralLoading,
      setpopupEvent,
      popupEvent,
      joinRoom,
      setRoomCookie,
      cookies,
      createRoom,
      messages,
      initializeSocketIO,
      connectRoomSocketIO,
      sendMessageToDB,
      setname,
      name,
      numberOfNewMessages,
      setnotificationObj,
      notificationObj,
      members,
      creator,
      leaveRoom,
      destroyRoom,
      getRoomFromDB,
      sendMediaToDB,
      setcurrentImageFullView,
      currentImageFullView
    }}>
      {children}
    </MainContext.Provider>
  )
}