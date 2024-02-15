import React from 'react'
import '../App.css'
import { useState, useRef } from 'react'
import color from '../assets/color'
import WhiteBoard from './WhiteBoard';


function Room() {
    const [input, setInput] = useState('pencil');
    const [colors, setColors] = useState(null);
    const [stroks, setStrok] = useState(null);
    const[elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [canvasImage, setCanvasImage] = useState(null);
    const canvasRef = useRef(null);
    const ctx = useRef(null);


    const handleDownload = () => {
        if (canvasRef.current) {
          const canvasImage = canvasRef.current.toDataURL();
          setCanvasImage(canvasImage);
          const downloadLink = document.createElement('a');
          downloadLink.href = canvasImage;
          downloadLink.download = 'canvas_image.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      };
    
    
  
    function handlInput(e) {
        setInput(e);
        if(input === 'arrow'){
            handleDownload();
        }
    }
    function handleColor(item) {
        setColors(item)
    }
    function handleStrok(item) {
        setStrok(item)
    }

    const undo = () => {
        setHistory((prevHistory) => [
          ...prevHistory,
          elements[elements.length - 1],
        ]);
        setElements((prevElements) =>
          prevElements.filter((ele, index) => index !== elements.length - 1)
        );
      };
      const redo = () => {
        setElements((prevElements) => [
          ...prevElements,
          history[history.length - 1],
        ]);
         
        console.log(history)
        if(history.length > 1){
            setHistory((prevHistory) =>
            prevHistory.filter((ele, index) => index !== history.length - 1)
          );
        }
        
      };
      const handleClearCanvas = () =>{
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setElements([]);
      }

    return (
        <>
            <p>&nbsp;</p>
            <center>
                <div className='drawing-box'>
                    <div onClick={() => handlInput('pencil')} className={input === 'pencil' ? 'active' : ''}><i class="fa fa-pencil"></i></div>
                    <div onClick={() => handlInput('rect')} className={input === 'rect' ? 'active' : ''}> <p className='reactangle'></p> </div>
                    <div onClick={() => handlInput('square')} className={input === 'square' ? 'active' : ''}><i class="fa fa-cube"></i></div>
                    <div onClick={() => handlInput('circle')} className={input === 'circle' ? 'active' : ''}><i class="fa fa-circle-o"></i></div>

                    <div onClick={() => handlInput('line')} className={input === 'line' ? 'active' : ''}><i class="fa fa-minus"></i></div>
                    <div onClick={() => handlInput('text')} className={input === 'text' ? 'active' : ''}><i class="fa fa-edit"></i></div>
                    <div onClick={() => handlInput('pic')} className={input === 'pic' ? 'active' : ''}><i class="fa fa-picture-o"></i></div>
                    <div onClick={() => handlInput('arrow')} className={input === 'arrow' ? 'active' : ''}><i class="fa fa-cloud-download"></i></div>
                    <div id='delete-canvas' style={{background:"rgb(185, 42, 42)"}} onClick={() => handleClearCanvas()} className={input === 'heart' ? 'active' : ''}><i style={{color:"#fff"}} class="fa fa-trash-o"></i>
                    <h4 className='hover-text' style={{width:"300px"}}>Clear Whiteboard</h4>
                    </div>
                    
                </div>
            </center>

            <div className='middle'>
                <div>
                    <div style={{ paddingBottom: "8px" }}><strong>Strok Color</strong></div>
                    <div className='colors'>
                        {color.map((item, index) => (
                            <div onClick={() => handleColor(item)} key={index} style={{ background: item, outline: item === colors ? '1.5px solid #000000' : '' }}></div>
                        ))}
                    </div>
                    <br />
                    <div style={{ paddingBottom: "8px" }}><strong>Strok Width</strong></div>
                    <div className='strok-width'>
                        <div onClick={() => handleStrok(1)} style={{ outline: stroks === 1 ? '1.5px solid #000000' : '' }}><p></p></div>
                        <div onClick={() => handleStrok(3)} style={{ outline: stroks === 3 ? '1.5px solid #000000' : '' }}><p style={{ height: "3px" }}></p></div>
                        <div onClick={() => handleStrok(5)} style={{ outline: stroks === 5 ? '1.5px solid #000000' : '' }}><p style={{ height: '5px' }}></p></div>
                    </div>
                    <br />
                    <div onClick={() => handlInput('eraser')} style={{background: input === 'eraser' ? '#7a8ac1' : '',border: input === 'eraser' ? '1px solid black' : ''}} className='eraser' ><strong>Eraser </strong><i  class="fa fa-eraser"></i></div>
                    <br />
                    <div className='undo-redo'>
                        <div onClick={()=> undo()}><i class="fa fa-mail-reply"></i></div>
                        <div onClick={()=> redo()}><i class="fa fa-mail-forward"></i></div>
                    </div>
                </div>

            </div>
            <div>
                <WhiteBoard 
                canvasRef={canvasRef}
                 ctx={ctx}
                 elements={elements}
                 setElements={setElements}
                 input={input}
                 setInput={setInput}
                 colors={colors}
                 setColors={setColors}
                 stroks={stroks}
                 setStrok={setStrok}
                 />
            </div>

        </>
    )
}

export default Room