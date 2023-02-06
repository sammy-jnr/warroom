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
function CreateRoom() {
  const {
    createRoom,
    // cookies,
    setRoomCookie,
    setgeneralLoading,
    initializeSocketIO,
    connectRoomSocketIO,
    setname
  } = useContext(MainContext)


  const [loading, setloading] = useState<boolean>(false)
  const [error, seterror] = useState<boolean>(false)

  const [roomName, setroomName] = useState<string>("")
  const [username, setusername] = useState<string>("")
  const [password, setpassword] = useState<string>("")

  const navigate = useNavigate()

  const CreateRoom = () => {
    if(loading)return;
    createRoom(username,password,roomName)
    .then((res:ResInterface)=>{
      const {username, roomId, joinPassword} = res.data
      if(!roomId)return
      initializeSocketIO()
      connectRoomSocketIO(roomId)
      setRoomCookie(joinPassword,roomId)
      setname(username)
      localStorage.setItem("channelOwner", "uhm sup devs")
      localStorage.setItem("username", username)
      setloading(false)
      setgeneralLoading(false)
      navigate(`/room/${roomId}`)
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      {loading ? 
        (<div className='createRoomLoadingDiv'>
          <div>
            <p id='createRoomLoadingText'>Creating room...</p>
            <span className="loader"></span>
          </div>
        </div>)
      :
      (<>
        <div className="createRoomContainer">
          <h3>Create Room</h3>
          <input type="name" className="" 
          spellCheck={false}
          placeholder='Room name'
          onChange={e => setroomName(e.target.value)}
          />
          <input type="name" className="" 
          spellCheck={false}
          placeholder='Username'
          onChange={e => setusername(e.target.value)}
          />
          <input type="password" className="" 
          spellCheck={false}
          placeholder='Room Password'
          onChange={e => setpassword(e.target.value)}
          />
          <button className="createRoomBtn"
          onClick={()=> {
            CreateRoom();
            seterror(false)
          }}
          >
            {"Create"}
          </button>

          {error && <p className="createRoomError">An error occured please try again</p>}
        </div>
      </>)
      }
    </>
  )
}

export default CreateRoom