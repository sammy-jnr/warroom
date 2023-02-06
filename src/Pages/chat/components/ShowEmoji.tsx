import React from 'react'
import EmojiPicker,{EmojiClickData} from "emoji-picker-react"
interface emojiProps{
  setchoosenEmoji: React.Dispatch<React.SetStateAction<EmojiClickData|undefined>>
}
const ShowEmoji:React.FC<emojiProps> = (props) => {

  return (
    <div className='displayEmojis'>
      <EmojiPicker height={"100%"} width={"100%"} onEmojiClick={(emojiObject,  e)=>{
        props.setchoosenEmoji(emojiObject)
      }}/>
    </div>
  )
}

export default ShowEmoji