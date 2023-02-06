import {useContext} from 'react'
import "./Popup.css"
import {MainContext} from "../../context/GeneralContext"
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'
import closeIcon from "../../Assets/Icons/closeIcon.svg"

function Popup() {
  const {generalLoading, popupEvent, setgeneralLoading} = useContext(MainContext)
  return (
    generalLoading ?
    <div className='popupContainer'>
      <img src={closeIcon} alt="" 
      className="closeIcon" 
      onClick={()=>{setgeneralLoading(false)}}
      />
      <div className='popupContainerInner'>
        {popupEvent === "createRoom" && <CreateRoom/>}
        {popupEvent === "joinRoom" && <JoinRoom/>}
      </div>
    </div>:null
  )
}

export default Popup