import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableIcon from './draggable-icon';
import DroppableZone from './droppable-zone';
import Toolbar from './toolbar';
import Ruler from './ruler';
import { CssBaseline, Box } from '@material-ui/core';

function App() {

  const [activeObject, setActiveObject] = useState(null);
  const [canvasSize, setCanvasSize] = useState({width: 400, height: 400, color: 'white'});
  const canvas = useRef(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <CssBaseline />
      <div className="App">
        <section className="section">
            <div className='item-container'>
              <div className='item-container-header'>ICONS</div>
              <div className='item-container-content'>
                <DraggableIcon imgSrc={'./svg/Pancreas.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Pancreas_gallblader.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Lung_right.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Lung_left.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Lung_right_leftai.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Liver.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Connexon.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Connexon_1.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Connexon_2.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Connexon_3.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Connexon_4.svg'}></DraggableIcon>
                <DraggableIcon imgSrc={'./svg/Connexon_5.svg'}></DraggableIcon>
              </div>
            </div>
          <div className="dropzone">
            <Toolbar activeObject={activeObject} canvas={canvas.current} canvasSize={canvasSize} setCanvasSize={setCanvasSize} />
            {/* <Graph /> */}
            {/* <Ruler /> */}
            <DroppableZone setActiveObject={setActiveObject} canvas={canvas} canvasSize={canvasSize} />
          </div>

        </section>

        {/* <canvas style={{width: '100%', height: '100%', border: '1px solid black'}} ref={canvas}></canvas> */}
      </div>
    </DndProvider>
  );
}

export default App;
