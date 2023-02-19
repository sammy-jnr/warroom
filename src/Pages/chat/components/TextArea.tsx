import { useContext } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import sendIcon from "../../../Assets/Icons/sendIcon.svg"
import emojiIcon from "../../../Assets/Icons/emojiIcon.svg"
import galleryIcon from "../../../Assets/Icons/galleryIcon.svg"
import { MainContext } from "../../../context/GeneralContext"
import { InputProps } from '../../../Interface'


const TextArea: React.FC<InputProps> = (props) => {
  const {
    sendMessageToDB
  } = useContext(MainContext)


  return (
    <div className='textAreaContainer'>
      <img src={emojiIcon} alt="" className="emojiIcon" onClick={() => props.setshowSelectEmojiPage(prev => !prev)} />
      <TextareaAutosize
        ref={props.inputRef}
        maxRows={4}
        onChange={(e) => props.setmessage(e.target.value)}
        className='textArea'
        placeholder='Write a message...'
      />
      <div className="uploadImageButton">
        <input type="file"
          id="imageInput"
          multiple
          name="files"
          ref={props.filesRef}
          onChange={(e) => props.onNewFile(e)} />
        <img src={galleryIcon} alt="" className="galleryIcon" />
      </div>
      <img src={sendIcon} alt="" className="sendIcon" onClick={() => {
        props.clearInputField()
        sendMessageToDB(props.message)
      }} />
    </div>
  )
}

export default TextArea