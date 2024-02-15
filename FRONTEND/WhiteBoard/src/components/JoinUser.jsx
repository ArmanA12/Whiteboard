import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';

function JoinUser({ socket, setUser, uuid }) {

    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate()


    const  handleJoinUser = () =>{
        navigate(`${roomId}`);
    }


    return (
        <>

<div className='form-g'>
      <div className='creat-from'>
        <div className='form-heading' style={{display:"flex", justifyContent:"center", alignItems:"center"}}><i class="fa fa-home"></i>&nbsp;<h3>Join Room</h3></div>
        <div>
          <form onSubmit={handleJoinUser} className='main-form'>
            <div><input onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter Your Name' required /></div>
            <div><input  type="text" placeholder='Enter Room ID'  value={roomId} />
            </div>
              
            
            <div><button className='submitbutton' type='submit'> Join Room</button></div>
            <div className='join'><NavLink to="/">Don't have roomID?  Create</NavLink></div>

          </form>
        </div>
      </div>
     
      </div>


        </>
    )
}

export default JoinUser