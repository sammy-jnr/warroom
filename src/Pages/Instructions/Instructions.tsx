import "./Instructions.css"
import backArrow from "../../Assets/Icons/backArrow.svg"
import { useNavigate } from "react-router-dom";


const Instructions = () => {
  const navigate = useNavigate()
  return (
    <div className='instructionsContainer'>
      <header>
        <img src={backArrow}
          alt=""
          className='backArrow' 
          onClick={()=>navigate(-1)}
          />
        <h2>Instructions</h2>
      </header>
      <section>
        <h3>Points to note</h3>
        <ul className='pointsList'>
          <li>when a room is created it expires after 1 day, but can be 
              deleted at any time by the creator
          </li>
          <li>when a group is destroyed neither message nor media can be recovered, it has been wiped from the surface of the earth</li>
          <li>The max capacity for rooms is 30 members</li>
          <li>Everyone including the creator will be deleted after 12hrs, 
            you can always login again using another username if the group is not full
          </li>
          <li>Messages and media cannot be deleted</li>
          <li>whatever you say cannot be traced back to you, by us or by anyone</li>
        </ul>
      </section>
    </div>
  )
}

export default Instructions