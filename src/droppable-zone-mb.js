import React, { useEffect, useRef } from 'react';
import './App.css';
import { ItemTypes } from './constants';
import { useDrop } from 'react-dnd';
import { initialisePaper } from './paper';
import { drawImage } from './paper';
import { fabric } from 'fabric';

function DroppableZone({canvasStyle, scale}) {
  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.ICON,
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      }),
      drop: (item, monitor) => {
        // console.log(monitor, monitor.getDifferenceFromInitialOffset(), monitor.getSourceClientOffset());
        // drawImage(item.imgSrc, monitor.getSourceClientOffset().x, monitor.getSourceClientOffset().y);
        fabric.Image.fromURL(item.imgSrc, img => {
          // img.set('initLeft', monitor.getSourceClientOffset().x - canvas.current._offset.left - ((screensRect.current.left - 2 - canvasRect.current.left)/canvasStyle.scale) - canvasStyle.startX);
          // img.set('initTop', monitor.getSourceClientOffset().y - canvas.current._offset.top - (canvasRect.current.top + screensRect.current.top - 145)/canvasStyle.scale + canvasStyle.startY);
          img.scale(0.2);
          canvas.current.add(img);
        }, {
            left: monitor.getSourceClientOffset().x - canvas.current._offset.left,
            top: monitor.getSourceClientOffset().y - canvas.current._offset.top,
            borderColor: '#198FFF',
            cornerColor: '#198FFF',
            cornerSize: 10,
            transparentCorners: false,
            cornerStyle: 'circle',
            padding: 10,
            initLeft: monitor.getSourceClientOffset().x - canvas.current._offset.left - ((screensRect.current.left - 2 - canvasRect.current.left)/coords.current.scale) + coords.current.startX,
            initTop: monitor.getSourceClientOffset().y - canvas.current._offset.top - (canvasRect.current.top + screensRect.current.top - 145)/coords.current.scale - coords.current.startY
          }
        );
      },
    })
  );

  const canvas = useRef(null);
  const rect = useRef(null);
  const canvasRect = useRef(null);
  const screensRect = useRef(null);
  const coords = useRef({});

  useEffect(() => {
    if(!canvas.current) {
      canvas.current = new fabric.Canvas('canvas', {
        backgroundColor: '#808d9c00',
        ...canvasStyle,
        selectionBorderColor: '#198FFF',
        selectionColor: '#198FFF45'
      });
    }
    canvasRect.current = document.querySelector('.canvas-container').getBoundingClientRect()
    screensRect.current = document.querySelector('#screens').getBoundingClientRect()
    canvas.current.setZoom(canvasStyle.scale);
    coords.current = {startX: canvasStyle.startX, startY: canvasStyle.startY, scale: canvasStyle.scale};
    // updateObjects();
  }, [canvas, canvasStyle.scale, canvasStyle.startX, canvasStyle.startY, rect]);

  const updateObjects = () => {
    const allObjects = canvas.current.getObjects();
    allObjects.forEach(object => {
      let left = ((screensRect.current.left - 2 - canvasRect.current.left)/canvasStyle.scale) - canvasStyle.startX,
      top = (canvasRect.current.top + screensRect.current.top - 145)/canvasStyle.scale + canvasStyle.startY;
      if (object.get('initLeft') && object.get('initTop')) {
        left += object.get('initLeft');
        top += object.get('initTop');
      }
      object.set('left', left);
      object.set('top', top);
      if(object.get('customType') !== 'rectBackground') {
        object.bringToFront();
      }
    });
  }

  return (
    <div ref={drop}>
      <div id="svgStr" style={{'backgroundColor': '#808d9c', position: 'absolute', height: '100%', width: '100%', top:'40px', left: '40px'}}>
        <svg style={{position: 'absolute', left: '-374px'}} width="4000px" height="2000px" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              {/* <rect width="80" height="80" fill="url(#smallGrid)"/> */}
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d8dfe8" strokeWidth="1"/>
            </pattern>
          </defs>
          <g id='fullGrid' transform="translate(0, -20)">
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </g>
          <g id='canvasRect' transform="translate(800, 100), scale(1)">
            <rect width="400px" height="400px" fill="#ffffff"/>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </g>

          {/* <rect width="100%" height="100%" fill="url(#grid)" /> */}
        </svg>
      </div>
      <canvas id="canvas"></canvas>
    </div>
  )
}

export default DroppableZone;