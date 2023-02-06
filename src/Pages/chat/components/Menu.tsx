import React from 'react'
import closeBlack from "../../../Assets/Icons/closeBlack.svg"
interface MenuProps {
  setshowMenu: React.Dispatch<React.SetStateAction<boolean>>,
  // showMenu: boolean
}
const Menu:React.FC<MenuProps> = (props) => {
  const channelOwner = localStorage.getItem("channelOwner")
  return (
    <div className='menuContainer'>
      <img src={closeBlack} alt="" className="closeIcon c-b" onClick={()=> props.setshowMenu(false)} />
      <b>Members</b>
      <ul className="membersList">
        <li>sammy</li>
        <li>sammy</li>
        <li>sammy</li>
        <li>sammy</li>
      </ul>
      <button>
        {channelOwner? "Destroy room" : "leave room"}
      </button>
    </div>
  )
}

export default Menu