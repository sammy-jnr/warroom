import {useState,useContext} from 'react'
import "../Popup.css"
import { MainContext } from "../../../context/GeneralContext"
import {useNavigate} from "react-router-dom"

interface ResInterface{
  data:{
    roomId:string,
    joinPassword:string,
    username:string
  }
}


function JoinRoom() {
  const {
    joinRoom,
    // cookies,
    setRoomCookie,
    setgeneralLoading,
    initializeSocketIO,
    connectRoomSocketIO,
    setname
  } = useContext(MainContext)

  const [loading, setloading] = useState<boolean>(false)
  const [roomId, setroomId] = useState<string>("")
  const [username, setusername] = useState<string>("")
  const [password, setpassword] = useState<string>("")


  const [invalidRoomId, setinvalidRoomId] = useState<boolean>(false)
  const [invalidPassword, setinvalidPassword] = useState<boolean>(false)
  const [usernameTaken, setusernameTaken] = useState<boolean>(false)



  const navigate = useNavigate()

  const enterRoom = () => {
    if(loading)return;
    joinRoom(username,password,roomId)
    .then((res:ResInterface)=>{
      console.log(res.data)
      const {username, roomId, joinPassword} = res.data
      if(!roomId)return
      initializeSocketIO()
      connectRoomSocketIO(roomId)
      setRoomCookie(joinPassword,roomId)
      setname(username)
      localStorage.setItem("username", username)
      setloading(false)
      setgeneralLoading(false)
      navigate(`/room/${roomId}`)
    })
    .catch(err => {
      if(err.response.data.msg === "room not found"){
        return setinvalidRoomId(true)
      }
      if(err.response.data.msg === "username taken"){
        return setusernameTaken(true)
      }
      if(err.response.data.msg === "invalid password"){
        return setinvalidPassword(true)
      }
    })
  }
  
  const onFocus = () => {
    setusernameTaken(false);
    setinvalidPassword(false);
    setinvalidRoomId(false);
  }
  return (
    <div className='joinRoomContainer'>
      <div>
        <h3>JOIN ROOM</h3>
        <input type="name" className="enterUsername" placeholder='Room ID'  
        onChange={(e)=>setroomId(e.target.value)}
        onFocus={onFocus}/>
        {invalidRoomId && <p className="errorText">Room ID is invalid</p>}

        <input type="password" placeholder='Room password' 
        onChange={(e)=>setpassword(e.target.value)}
        onFocus={onFocus}/>
        {invalidPassword && <p className="errorText">Wrong room password</p>}

        <input type="name" className="enterUsername" placeholder='username' 
        onChange={(e)=>setusername(e.target.value)}
        onFocus={onFocus}/>
        {usernameTaken && <p className="errorText">Username has be taken</p>}
      </div>
      <button
      onClick={()=>{
        enterRoom()
      }}
      >
      {loading && <span className="circleLoader"></span>}
        {!loading && "Enter"}
        </button>
    </div>
  )
}

export default JoinRoom