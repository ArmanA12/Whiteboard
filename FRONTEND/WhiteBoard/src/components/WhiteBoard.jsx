import React from 'react'
import rough from 'roughjs';
import { useState, useEffect, useLayoutEffect } from 'react';
import Draggable from 'react-draggable';
import io from "socket.io-client";


const generator = rough.generator();


const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket = io(server, connectionOptions)




function WhiteBoard({ canvasRef,
  ctx,
  setElements,
  elements,
  input,
  setInput,
  colors,
  setColors,
  stroks,
  setStrok
}) {

  const [isDrawing, setIsDrawing] = useState(false);
  const [showText, setShowText] = useState(false);

  const [img, setImg] = useState(null)


  // Assuming you have a socket instance created somewhere



  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 1;
    canvas.width = window.innerWidth * 1;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");
    ctx.current = context;
    context.strokeStyle = colors;

  }, [])


  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (input === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          element: input,
          stroke: colors,
        },
      ]);
    }
    else if (input === "eraser") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          element: input,
        },
      ]);

    }
    else if (input === 'text') {
      setShowText(true)
    }


    else if (input === "square") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          element: input,
          stroke: colors,

        },
      ]);
    }

    else {
      setElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: colors, fill: colors, element: input },
      ]);
    }

    setIsDrawing(true);
  }


  useEffect(() => {
    ctx.current.strokeStyle = colors;
  }, [colors]);




  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    if (elements.length > 0) {
      ctx.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    elements.forEach((ele, i) => {
      if (ele.element === "pencil") {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: stroks,
        });
      }
      else if (ele.element === "eraser") {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: stroks,
        });
        setColors('#ffffff')
      }
      else if (ele.element === "square") {
        roughCanvas.polygon(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: stroks,
        });
      }

      else if (ele.element === "line") {
        roughCanvas.draw(
          generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            roughness: 0,
            strokeWidth: stroks,

          })
        );
      }
      else if (ele.element === "rect") {
        roughCanvas.draw(
          generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            roughness: 0,
            strokeWidth: stroks,
          })
        );
      }
      else if (ele.element === "circle") {
        roughCanvas.draw(
          generator.circle(ele.offsetX, ele.offsetY, ele.width - ele.height, {
            roughness: 0,
            strokeWidth: stroks,
            strokeStyle: colors
          })
        );
      }
    });
    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("whiteBoardData", canvasImage)

  }, [elements]);


  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;
    if (input === "pencil") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              path: [...ele.path, [offsetX, offsetY]],
              element: ele.element,
            }
            : ele
        )
      );
    }

    if (input === "eraser") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              path: [...ele.path, [offsetX, offsetY]],
              element: ele.element,
            }
            : ele
        )
      );
    }

    else if (input === "square") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              path: [...ele.path, [offsetX, offsetY]],
              element: ele.element,
            }
            : ele
        )
      );
    }

    else if (input === "line") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              width: offsetX,
              height: offsetY,
              element: ele.element,
            }
            : ele
        )
      );
    }

    else if (input === "rect") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              width: offsetX - ele.offsetX,
              height: offsetY - ele.offsetY,
              element: ele.element,
            }
            : ele
        )
      );
    }

    else if (input === "circle") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              width: offsetX - ele.offsetX,
              height: offsetY - ele.offsetY,
              element: ele.element,
            }
            : ele
        )
      );
    }
  };


  const handleMouseUp = (e) => {
    setIsDrawing(false)
  }

  const host = localStorage.getItem('host')

  return (
    <>
    <div className='whitecanvas'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
      {
        showText ? <Draggable>
          <input style={{
            position: 'absolute',
            top: "150px", left: "50%", height: "30px", border: "transparent", outline: "1px solid #000000"
          }} type="text" placeholder="|" />
        </Draggable> : ''
      }

    </div>
    </>
  )
}

export default WhiteBoard