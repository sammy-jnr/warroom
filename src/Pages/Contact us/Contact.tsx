import { useState, useRef, useContext } from "react";
import "./Contact.css"
import backArrow from "../../Assets/Icons/backArrow.svg"
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/GeneralContext"


const Contact = () => {
  const navigate = useNavigate()

  const {
    setnotificationObj,
    sendReportMail
  } = useContext(MainContext)

  const nameRef: React.Ref<HTMLInputElement> | null = useRef(null)
  const emailRef: React.Ref<HTMLInputElement> | null = useRef(null)
  const reportRef: React.Ref<HTMLTextAreaElement> | null = useRef(null)

  const [isNameShort, setisNameShort] = useState(true);
  const [isEmailCorrect, setisEmailCorrect] = useState(true);
  const [isMessagePresent, setisMessagePresent] = useState(true);


  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (nameRef.current && nameRef.current?.value.length < 2) {
      setisNameShort(false)
      return
    }
    if (emailRef.current && !emailRef.current?.value.includes("@")) {
      setisEmailCorrect(false)
      return
    }
    if (reportRef.current && reportRef.current?.value.length < 1) {
      setisMessagePresent(false)
      return
    }
    if (nameRef.current && emailRef.current && reportRef.current)
      sendReportMail(nameRef.current.value, emailRef.current.value, reportRef.current.value)
        .then(() => {
          if (nameRef.current && emailRef.current && reportRef.current) {
            nameRef.current.value = ""
            emailRef.current.value = ""
            reportRef.current.value = ""
          }
          setnotificationObj({
            backgroundColor: "green",
            text: "successful!",
            status: true,
            time: 2000,
            fontSize: 16
          })
        })
        .catch((err) => {
          setnotificationObj({
            backgroundColor: "red",
            text: "an error occurred!",
            status: true,
            time: 3000,
            fontSize: 15
          })
        })
  }

  const onFocus = () => {
    setisNameShort(true)
    setisEmailCorrect(true)
    setisMessagePresent(true)
  }
  return (
    <div className='contactContainer'>
      <header>
        <img src={backArrow}
          alt=""
          className='backArrow hoverable'
          onClick={() => navigate(-1)}
        />
        <h2>Contact Us</h2>
      </header>
      <section>
        <form onSubmit={(e) => submitForm(e)}>
          <input type="name" placeholder="Name" name="Name" onFocus={onFocus} ref={nameRef} />
          <input type="email" placeholder="Email" name="Email" onFocus={onFocus} ref={emailRef} />
          <textarea name="report" id="" placeholder="Your reason for writing us?" onFocus={onFocus} ref={reportRef}></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>
      <div className="errorsContactForm">
        {!isNameShort && <p>Name is too short</p>}
        {!isEmailCorrect && <p>Email must contain '@'</p>}
        {!isMessagePresent && <p>Some fields are empty</p>}
      </div>
    </div>
  )
}

export default Contact