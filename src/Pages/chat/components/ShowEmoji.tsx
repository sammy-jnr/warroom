import EmojiPicker from "emoji-picker-react"
import { EmojiProps } from '../../../Interface'


const ShowEmoji: React.FC<EmojiProps> = (props) => {

  return (
    <div className='displayEmojis'>
      <EmojiPicker height={"100%"} width={"100%"} onEmojiClick={(emojiObject, e) => {
        props.setchoosenEmoji(emojiObject)
      }} />
    </div>
  )
}

export default ShowEmoji