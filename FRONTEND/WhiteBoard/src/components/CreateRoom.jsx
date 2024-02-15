import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import io from "socket.io-client";
import JoinUser from './JoinUser';
import WhiteBoard from './WhiteBoard';


const server = "http://localhost:5000";

const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket = io(server, connectionOptions)


function CreateRoom() {

  const navigate = useNavigate()
  let { roomID } = useParams();
  const [user, setUser] = useState('')
  const [roomJoined, setRoomJoined] = useState(false);


  useEffect(() => {
    if (roomJoined) {
      socket.emit("user-joined", user);
    }
  }, [roomJoined]);

  useEffect(() => {
    socket.on('whiteBoardresponse', (data) => {
      console.log(data);
      localStorage.setItem('data', data)
      setImg(data);
    });
  }, []); // Make sure to have the correct dependency array
  


  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState('');

  function handleCreateRoom(e) {
    e.preventDefault();
    if (socket) {
      const roomData = {
        name,
        roomId,
        userId: uuid(),
        host: true,
        presenter: true,
      };
      socket.emit('userJoined', roomData);
      console.log(roomData)
    } else {
      console.error('Socket is undefined.');
    }

    // Check if navigate is defined before calling it
    if (navigate) {
      navigate(`${roomId}`);
    } else {
      console.error('Navigate function is undefined.');
    }
  }


  function handleJoinUser(e) {
    e.preventDefault();
    localStorage.setItem('host','not')
    if (socket) {
      const roomData = {
        name,
        roomId,
        userId: uuid(),
        host: false,
        presenter: false,
      };
      socket.emit('userJoined', roomData);
      console.log(roomData)
    } else {
      console.error('Socket is undefined.');
    }

    // Check if navigate is defined before calling it
    if (navigate) {
      navigate(`${roomId}`);
    } else {
      console.error('Navigate function is undefined.');
    }
  }

  return (
    <>

      <div className='form-g'>
      <div className='creat-from'>
        <div className='form-heading' style={{display:"flex", justifyContent:"center", alignItems:"center"}}><i class="fa fa-home"></i>&nbsp;<h3>Create Room</h3></div>
        <div>
          <form onSubmit={handleCreateRoom} className='main-form'>
            <div><input onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter Your Name' required /></div>
            <div><input disabled={true} type="text" placeholder='Generate Room ID' readOnly={true} value={roomId} />
            </div>
             <div> 
              <button style={{width:"48%"}} type='button' onClick={() => setRoomId(uuid())}>Generate</button>
              <CopyToClipboard style={{width:"48%"}}
                text={roomId}
                onCopy={() => toast.success("Room Id Copied To Clipboard!")}
              >
                <button
                  className="btn btn-outline-dark border-0 btn-sm"
                  type="button"
                >
                  Copy
                </button>
              </CopyToClipboard>

             </div>
              
            
            <div><button className='submitbutton' type='submit'> Create Room</button></div>
            <div className='join'><NavLink to="/joinRoom">If you have roomID?  Join</NavLink></div>

          </form>
        </div>
      </div>
     
      </div>

    </>
  )
}

export default CreateRoom