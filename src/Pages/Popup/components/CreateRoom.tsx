import { useState, useContext } from "react";
import "../Popup.css";
import { MainContext } from "../../../context/GeneralContext";
import { useNavigate } from "react-router-dom";
import { ResInterface } from "../../../Interface";
import { generateRandomColor } from "../../../utils/generateRandomColor";

function CreateRoom() {
  const {
    createRoom,
    setRoomCookie,
    setgeneralLoading,
    initializeSocketIO,
    connectRoomSocketIO,
    setname,
    getRoomFromDB,
  } = useContext(MainContext);

  const [loading, setloading] = useState<boolean>(false);
  const [error, seterror] = useState<boolean>(false);

  const [roomName, setroomName] = useState<string>("");
  const [username, setusername] = useState<string>("");
  const [password, setpassword] = useState<string>("");

  const [isRoomNameShort, setisRoomNameShort] = useState<boolean>(false);
  const [isUsernameShort, setisUsernameShort] = useState<boolean>(false);
  const [isPasswordShort, setisPasswordShort] = useState<boolean>(false);

  const navigate = useNavigate();

  const CreateRoom = () => {
    if (roomName.length < 3) {
      setisRoomNameShort(true);
      return;
    }
    if (username.length < 3) {
      setisUsernameShort(true);
      return;
    }
    if (password.length < 6) {
      setisPasswordShort(true);
      return;
    }

    if (loading) return;
    generateRandomColor()
    createRoom(username, password, roomName)
      .then((res: ResInterface) => {
        const { username, roomId, joinPassword } = res.data;
        if (!roomId) return;
        initializeSocketIO();
        connectRoomSocketIO(roomId);
        setRoomCookie(joinPassword, roomId);
        getRoomFromDB(roomId, joinPassword);
        setname(username);
        localStorage.setItem("channelOwner", "uhm sup devs");
        localStorage.setItem("username", username);
        setloading(false);
        setgeneralLoading(false);
        navigate(`/room`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {loading ? (
        <div className="createRoomLoadingDiv">
          <div>
            <p id="createRoomLoadingText">Creating room...</p>
            <span className="loader"></span>
          </div>
        </div>
      ) : (
        <>
          <div className="createRoomContainer">
            <h3>Create Room</h3>
            <input
              type="name"
              className=""
              spellCheck={false}
              placeholder="Room name"
              onChange={(e) => setroomName(e.target.value)}
              onFocus={() => setisRoomNameShort(false)}
            />
            {isRoomNameShort && (
              <div className="errorText">Room name is too short</div>
            )}
            <input
              type="name"
              className=""
              spellCheck={false}
              placeholder="Username"
              onChange={(e) => setusername(e.target.value)}
              onFocus={() => setisUsernameShort(false)}
            />
            {isUsernameShort && (
              <div className="errorText">Username is too short</div>
            )}
            <input
              type="password"
              className=""
              spellCheck={false}
              placeholder="Room Password"
              onChange={(e) => setpassword(e.target.value)}
              onFocus={() => setisPasswordShort(false)}
            />
            {isPasswordShort && (
              <div className="errorText">Password is too short</div>
            )}
            <button
              className="createRoomBtn"
              onClick={() => {
                CreateRoom();
                seterror(false);
              }}
            >
              {"Create"}
            </button>

            {error && (
              <p className="createRoomError">
                An error occured please try again
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default CreateRoom;
