import {createContext, useEffect, useState} from "react"
import axios from "axios"
import {AxiosResponse} from "axios"
import { useCookies } from "react-cookie";
import {io} from "socket.io-client"
import {Message} from "../Interface"


interface AuthContextProviderProps {
  children: React.ReactNode
}



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
  numberOfNewMessages: number
}

export const MainContext = createContext<MainContextInterface>({} as MainContextInterface)

export function MainProvider ({children}:AuthContextProviderProps){

  const [cookies, setCookie] = useCookies(["roomId","joinPassword"]);
  const [generalLoading, setgeneralLoading] = useState<boolean>(false);
  const [popupEvent, setpopupEvent] = useState<string|null>("");
  const [messages, setmessages] = useState<Message[]|undefined>();
  const [name, setname] = useState<string|undefined>();
  const [numberOfNewMessages, setnumberOfNewMessages] = useState<number>(0);
  
  //TODO add message state and connect it to login

  const socket = io("http://localhost:5000")
  
  const initializeSocketIO = ()=>{
    socket.on("connect",()=>{
    console.log(socket.id)
    })
  }

  useEffect(()=>{
    if(!cookies.roomId)return;
    getDocsFromDB(cookies.roomId, cookies.joinPassword)
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

  const sendMessageSocketIO = (roomId:string) => {
    socket.emit("sendMessage",roomId)
  }

  socket.on("updateMessage", (message:Message[])=>{
    setmessages(message)
    setnumberOfNewMessages(prev => prev +=1)
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
  const getDocsFromDB = (roomId:string, joinPassword:string) => {
    axios({
      method: "post",
      data:{
        roomId,
        joinPassword
      },
      url: "http://localhost:5000/getMessages",
      withCredentials: true
    })
    .then((res)=>{
      if(!res.data){
        console.error("No data")
      }
      setmessages(res.data)
    })
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
      numberOfNewMessages
    }}>
      {children}
    </MainContext.Provider>
  )
}