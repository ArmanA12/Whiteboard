import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const server = 'http://localhost:5000';
const connectionOptions = {
  'force new connection': true,
  reconnectionAttempts: 'Infinity',
  timeout: 10000,
  transports: ['websocket'],
};
const socket = io(server, connectionOptions);

function Third() {
  const [img, setImg] = useState(null);

  useEffect(() => {


    socket.on('whiteBoardresponse', (data) => {
        console.log(data)

      setImg((prevImg) => {
        if (prevImg !== data.imgUrl) {
          console.log(data);
          return data.imgUrl;
        }
        return prevImg;
      });
    });
  }, [img]);

  return (
    <>
      <div>Third</div>
      <p>{img}</p>
      <img  src={img} alt="" />
    </>
  );
}

export default Third;
