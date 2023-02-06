import React,{useState, useRef,useContext, useEffect} from 'react'
import downIcon from "../../../Assets/Icons/downIcon.svg"
import { MainContext } from "../../../context/GeneralContext"

  interface UnReadMessages{
    status: boolean,
    message: number
  }
function TextDisplay() {

  const scrollRef:React.Ref<HTMLDivElement>|null = useRef(null)
  const bottomRef:React.Ref<HTMLDivElement>|null = useRef(null)

  const {
    messages,
    name,
    numberOfNewMessages
  } = useContext(MainContext)

  const [showNewUnreadMessage, setshowNewUnreadMessage] = useState<boolean>(true);
  const [showUreadMessagesNumber, setshowUreadMessagesNumber] = useState(false);


  useEffect(()=>{
    controlScrollBehaviour()
  },[messages])


  const onScroll = () => {
    setshowUreadMessagesNumber(false)
    if(scrollRef.current?.scrollTop && scrollRef.current?.clientHeight){
      if((scrollRef.current?.scrollHeight - scrollRef.current?.scrollTop - scrollRef.current?.clientHeight) <= (150)){
        setshowNewUnreadMessage(false)
      }else{
        setshowNewUnreadMessage(true)
      }
    }
  }
  const controlScrollBehaviour = ()=>{
    if(scrollRef.current?.scrollTop && scrollRef.current?.clientHeight){
      if((scrollRef.current?.scrollHeight - scrollRef.current?.scrollTop - scrollRef.current?.clientHeight) <= (150)){
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start'})
        setshowNewUnreadMessage(false)
      }else{
        setshowUreadMessagesNumber(true)
        setshowNewUnreadMessage(true)
        console.log(showNewUnreadMessage)
      }
    }
  }
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start'})
    setshowNewUnreadMessage(false)

  }

  const mappedMessages = messages?.map((item,index)=>{
    if(item.sender === name){
      return(
      <div className='myMessages'>
        <p>{item.message}</p>
      </div>
      )
    }else{
      return(
        <div className='otherMessages'>
          <p className='otherMessageSender'>{item.sender}</p>
          <p>{item.message}</p>
        </div>
      )
    }
  }) 


  return (
    <div className='displayChatsContainer' ref={scrollRef} onScroll={()=>onScroll()}>
      {mappedMessages}
      <div ref={bottomRef}></div>
      {showNewUnreadMessage && 
        <div className="unReadMeassagesDisplay">
        {showUreadMessagesNumber && <div>
          {numberOfNewMessages}
          </div>}
        <img src={downIcon} alt="" className="downIcon" onClick={()=>scrollToBottom()}/>
    </div>
      }
      
    </div>
  )
}

export default TextDisplay