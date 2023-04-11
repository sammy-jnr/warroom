import { useContext } from 'react'
import closeBlack from "../../../Assets/Icons/closeBlack.svg"
import { MainContext } from "../../../context/GeneralContext"
import { MenuProps } from '../../../Interface'


const Menu: React.FC<MenuProps> = (props) => {

  const {
    creator,
    members,
    name,
    leaveRoom,
    cookies,
    destroyRoom
  } = useContext(MainContext)

  const removeRoom = () => {
    if (creator === name) {
      destroyRoom(cookies.roomId, cookies.joinPassword)
      console.log("destroyRoom")
    } else {
      leaveRoom(cookies.roomId, cookies.joinPassword)
      console.log("leaveRoom")
    }
  }

  return (
    <div className='menuContainer'>
      <img src={closeBlack} alt="" className="closeIcon c-b hoverable" onClick={() => props.setshowMenu(false)} />
      <p><b>Members</b> <span>{members?.length}</span></p>
      <ul className="membersList">
        {
          members?.map((item, index) => {
            return (<li key={index}>{item}</li>)
          })
        }
      </ul>
      <button
        onClick={removeRoom}
      >
        {creator === name ? "Destroy room" : "leave room"}
      </button>
    </div>
  )
}

export default Menu