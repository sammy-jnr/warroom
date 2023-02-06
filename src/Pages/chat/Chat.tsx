import React, {useState, useEffect, useRef} from 'react'
import "./Chat.css"
import menuWhiteIcon from "../../Assets/Icons/menuWhite.svg"
import closeIcon from "../../Assets/Icons/closeIcon.svg"
import Menu from './components/Menu'
import TextArea from './components/TextArea'
import TextDisplay from './components/TextDisplay'
import ShowEmoji from './components/ShowEmoji'
import {EmojiClickData} from "emoji-picker-react"

 
function Chat() {
  const [showMenu, setshowMenu] = useState<boolean>(false);
  const [showSelectEmojiPage, setshowSelectEmojiPage] = useState<boolean>(false);
  const [choosenEmoji, setchoosenEmoji] = useState<EmojiClickData|undefined>();
  const inputRef:React.Ref<HTMLTextAreaElement>|null = useRef(null)

  useEffect(() => {
    if(!choosenEmoji)return
    inputRef.current?.focus()
    if(inputRef.current && choosenEmoji?.emoji){
      let firstHalfOfTheValue = inputRef.current.value.substring(0,inputRef.current.selectionStart)
      let secondHalfOfTheValue = inputRef.current.value.substring(inputRef.current.selectionStart, inputRef.current.value.length)
      inputRef.current.value = firstHalfOfTheValue + choosenEmoji.emoji + secondHalfOfTheValue
      setchoosenEmoji(undefined)
    }
  }, [choosenEmoji]);
  return (
    <div className='chatContainer'>
      <img src={menuWhiteIcon} alt="" className="menuIcon" onClick={()=>setshowMenu(true)}/>
      {showMenu && <Menu setshowMenu={setshowMenu}/>}
      <div className="copyRoomLinkDiv">
        <p><b>Room link:</b> this is a link to be copied</p>
        <img src={closeIcon} alt="" className="closeLink" />
      </div>
      <div className="fullChatArea">
        <div className="chatArea2">
        <Menu setshowMenu={setshowMenu}/>
        </div>
        <div className="chatArea1">
        {showSelectEmojiPage && <ShowEmoji setchoosenEmoji={setchoosenEmoji}/>}
          <TextDisplay/>
          <TextArea inputRef={inputRef} setshowSelectEmojiPage={setshowSelectEmojiPage}/>

        </div>
        
      </div>
    </div>
  )
}

export default Chat