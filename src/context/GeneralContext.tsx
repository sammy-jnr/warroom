import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { useCookies } from "react-cookie";
import { io } from "socket.io-client"
import { getUserColor } from "../utils/generateRandomColor";
import {
  Message,
  AuthContextProviderProps,
  NotificationObjectInterface,
  RoomInterface,
  CurrentImageFullViewInterface,
  MainContextInterface
} from "../Interface"

export const MainContext = createContext<MainContextInterface>({} as MainContextInterface)



export function MainProvider({ children }: AuthContextProviderProps) {

  const baseUrl = process.env.REACT_APP_BASE_URL
  const [cookies, setCookie, removeCookie] = useCookies(["roomId", "joinPassword"]);
  const [generalLoading, setgeneralLoading] = useState<boolean>(false);
  const [popupEvent, setpopupEvent] = useState<string | null>("");
  const [messages, setmessages] = useState<Message[] | undefined>();
  const [members, setmembers] = useState<string[] | undefined>();
  const [name, setname] = useState<string | undefined>();
  const [numberOfNewMessages, setnumberOfNewMessages] = useState<number>(0);
  const [creator, setcreator] = useState<string | null>(null);
  const [notificationObj, setnotificationObj] = useState<NotificationObjectInterface | null>();
  const [currentImageFullView, setcurrentImageFullView] = useState<CurrentImageFullViewInterface>();
  const [uploadImageLoading, setuploadImageLoading] = useState<boolean>(false);
  const [showRedDot, setshowRedDot] = useState<boolean>(true);
  const [showPreviewImagePage, setshowPreviewImagePage] = useState(false);



  const socket = io("http://localhost:5000")

  const initializeSocketIO = () => {
    socket.on("connect", () => { })
  }

  useEffect(() => {
    if (!cookies.roomId) return;
    getRoomFromDB(cookies.roomId, cookies.joinPassword)
    initializeSocketIO()
    connectRoomSocketIO(cookies.roomId)
    const name = localStorage.getItem("username")
    if (name) {
      setname(name)
    }
  }, [])

  const connectRoomSocketIO = (room: string) => {
    socket.emit("joinRoom", room, (message: Message[]) => {
      setmessages(message)
    })
  }

  // this makes all users in that room fetch an updated array of the messages after a message is sent
  const sendMessageSocketIO = (roomId: string) => {
    socket.emit("sendMessage", roomId)
  }

  socket.on("updateMessage", (message: Message[]) => {
    setmessages(message)
    setnumberOfNewMessages(prev => prev += 1)
  })
  socket.on("startDestruction", () => {
    removeCookie("roomId", { path: '/' })
    removeCookie("joinPassword", { path: '/' })
    window.location.reload()
  })
  socket.on("updateMembers", (members: string[]) => {
    setmembers(members)
    setshowRedDot(true)
  })



  const joinRoom = (username: string, password: string, roomId: string) => {
    return axios({
      method: "post",
      data: {
        username,
        password,
        roomId
      },
      withCredentials: true,
      url: `${baseUrl}/joinRoom`,
    })
  }

  const createRoom = (username: string, password: string, roomName: string) => {
    return axios({
      method: "post",
      data: {
        username,
        password,
        roomName,
      },
      withCredentials: true,
      url: `${baseUrl}/createRoom`,
    })
  }

  const setRoomCookie = (joinPassword: string, roomId: string) => {
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

  const sendMessageToDB = (message: string) => {
    if (message.length < 1) return
    const roomId = cookies.roomId
    const joinPassword = cookies.joinPassword
    if (!roomId || !name) return;
    const username = name
    return axios({
      method: "post",
      data: {
        message: {
          sender: username,
          message: message,
          color: getUserColor()
        },
        roomId: roomId,
        joinPassword: joinPassword
      },
      withCredentials: true,
      url: `${baseUrl}/sendMessage`,
    })
      .then((res) => {
        res.data && setmessages(res.data);
        sendMessageSocketIO(roomId)
      })
      .catch(err => console.log(err))
  }

  const getRoomFromDB = (roomId: string, joinPassword: string) => {
    axios({
      method: "post",
      data: {
        roomId,
        joinPassword
      },
      url: `${baseUrl}/getRoom`,
      withCredentials: true
    })
      .then((res) => {
        if (!res.data) {
          console.error("No data")
          return
        }
        const room: RoomInterface = res.data.room
        setmessages(room.messages)
        setmembers(room.members)
        setcreator(room.creator)
      })
  }

  const leaveRoom = (roomId: string, joinPassword: string) => {
    if (!name) return
    axios({
      withCredentials: true,
      url: `${baseUrl}/leaveRoom`,
      method: "post",
      data: {
        roomId,
        joinPassword,
        username: name
      }
    })
      .then(() => {
        removeCookie("roomId", { path: '/' })
        removeCookie("joinPassword", { path: '/' })
        window.location.reload()
      })
      .catch(err => console.log(err))
  }

  const destroyRoom = (roomId: string, joinPassword: string) => {
    if (!name) return
    axios({
      withCredentials: true,
      url: `${baseUrl}/destroyRoom`,
      method: "post",
      data: {
        roomId,
        joinPassword,
      }
    })
      .then(() => {
        socket.emit("destroyRoom", roomId)
        removeCookie("roomId", { path: '/' })
        removeCookie("joinPassword", { path: '/' })
        window.location.reload()
      })
      .catch(err => console.log(err))
  }

  const sendMediaToDB = (formData: FormData) => {
    axios({
      method: "post",
      withCredentials: true,
      url: `${baseUrl}/sendMedia`,
      data: formData
    })
      .then((res) => {
        if (!res.data) return
        setmessages(res.data.msg)
        sendMessageSocketIO(cookies.roomId)
        setuploadImageLoading(false)
        setshowPreviewImagePage(false)
      })
      .catch(err => {
        setuploadImageLoading(false)
        setnotificationObj({
          backgroundColor: "red",
          text: err.response.data.msg,
          status: true,
          time: 3500,
          fontSize: 16
        })
      })
  }

  const sendReportMail = (name:string, email:string, message:string) => {
    return axios({
      url: `${baseUrl}/sendMail`,
      withCredentials: true,
      data: {
        message,
        name,
        email
      },
      method: "post"
    })
  }

  return (
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
      currentImageFullView,
      setuploadImageLoading,
      uploadImageLoading,
      setshowRedDot,
      showRedDot,
      sendReportMail,
      setshowPreviewImagePage,
      showPreviewImagePage
    }}>
      {children}
    </MainContext.Provider>
  )
}