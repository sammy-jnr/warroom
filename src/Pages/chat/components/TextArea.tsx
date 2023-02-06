import {useState,useContext} from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import sendIcon from "../../../Assets/Icons/sendIcon.svg"
import emojiIcon from "../../../Assets/Icons/emojiIcon.svg"
import galleryIcon from "../../../Assets/Icons/galleryIcon.svg"
import { MainContext } from "../../../context/GeneralContext"

interface InputProps{

  // props: {}
  inputRef: React.Ref<HTMLTextAreaElement>|null,
  setshowSelectEmojiPage: React.Dispatch<React.SetStateAction<boolean>>
}
const TextArea:React.FC<InputProps> = (props) => {
  const {
   sendMessageToDB
  } = useContext(MainContext)
  const [message,setmessage] = useState("")
  return (
    <div className='textAreaContainer'>
      <img src={emojiIcon} alt="" className="emojiIcon" onClick={()=> props.setshowSelectEmojiPage(prev => !prev)}/>
      <TextareaAutosize
      ref={props.inputRef}
      maxRows={4} 
      onChange={(e)=>setmessage(e.target.value)}
      className='textArea'
      placeholder='Write a message...'
      />
      <img src={galleryIcon} alt="" className="galleryIcon" />
      <img src={sendIcon} alt="" className="sendIcon" onClick={()=>{
        sendMessageToDB(message)
        console.log("clicked")
        }}/>
    </div>
  )
}

export default TextArea