import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ItemTypes } from './constants';
import { useDrop } from 'react-dnd';
import { initialisePaper } from './paper';
import { drawImage } from './paper';
import { fabric } from 'fabric';
import ruler from './lib/ruler.js';

function DroppableZone({ canvas, setActiveObject, canvasSize }) {
  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.ICON,
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      }),
      drop: (item, monitor) => {
        // console.log(monitor, monitor.getDifferenceFromInitialOffset(), monitor.getSourceClientOffset());
        // drawImage(item.imgSrc, monitor.getSourceClientOffset().x, monitor.getSourceClientOffset().y);
        const left = monitor.getSourceClientOffset().x - canvas.current._offset.left;
        const top = monitor.getSourceClientOffset().y - canvas.current._offset.top;
        fabric.loadSVGFromURL(item.imgSrc, function(objects, options) {
          var obj = fabric.util.groupSVGElements(objects, options);
          obj.scale(0.25);
          obj.set({
            left,
            top,
            borderColor: '#198FFF',
            cornerColor: '#198FFF',
            cornerSize: 10,
            transparentCorners: false,
            cornerStyle: 'circle'
            // initLeft: monitor.getSourceClientOffset().x - canvas.current._offset.left,
            // initTop: monitor.getSourceClientOffset().y - canvas.current._offset.top
          })
          canvas.current.add(obj).renderAll();
        });
      },
    })
  );

  const ruler1 = useRef(null);
  const rect = useRef(null);
  const initX = useRef(null);
  const initY = useRef(null);
  const gridGroup = useRef(null);
  const scale = useRef(1);

  useEffect(() => {
    if (!canvas.current) {
      canvas.current = new fabric.Canvas('canvas', {
        backgroundColor: '#808d9c00',
        width: 1440,
        height: 700,
        selectionBorderColor: '#198FFF',
        selectionColor: '#198FFF45',
        hoverCursor: 'default'
      });
      document.onkeydown = (e) => {
        if (e.keyCode === 8) {
          const objects = canvas.current.getActiveObjects();
          objects.forEach(obj => {
            canvas.current.remove(obj);
          });
        }
      }
      document.querySelector('.upper-canvas').addEventListener('mousedown', function() {
        setActiveObject(canvas.current.getActiveObjects());
      });
      // document.querySelector('.dropzone-editor').addEventListener('scroll', handleScroll);
      // document.querySelector('.screen-container').addEventListener('wheel', handleWheel);
    }
    ruler1.current = new ruler({
      container: document.querySelector('.dropzone-editor'),// reference to DOM element to apply rulers on
      rulerHeight: 25, // thickness of ruler
      fontFamily: 'arial',// font for points
      fontSize: '7px',
      strokeStyle: 'black',
      lineWidth: 1,
      enableMouseTracking: true,
      enableToolTip: true
    });
    ruler1.current.api.setPos({y: -300});
    ruler1.current.api.setPos({x: 0});
    // initX.current = 1800;

    // rect.current = new fabric.Rect({
    //   left: 402,
    //   top: 102,
    //   fill: '#ffffff',
    //   width: 400,
    //   height: 400,
    //   selectable: false,
    //   customType: 'rectBackground',
    //   hoverCursor: 'default'
    // });
    // canvas.current.add(rect.current);
    // fabric.loadSVGFromString(document.querySelector('#svgStr').innerHTML, (objects, options) => {
    //   objects.forEach(object => {
    //     canvas.current.add(object);
    //   });
    //   // canvas.current.add.apply(canvas.current, objects);
    //   canvas.current.renderAll();
    // })
    // updateGrid();

    // document.querySelector('#screens').addEventListener('scroll', handleScroll);
    // document.querySelector('.screen-container').addEventListener('wheel', handleWheel);
  }, [canvas.current]);

  const handleWheel = e => {
    if (e.ctrlKey || e.metaKey) {
      const screensRect = document.querySelector('.upper-canvas').getBoundingClientRect();
      e.preventDefault();
      const nextScale = parseFloat(Math.max(0.2, scale.current - e.deltaY/50).toFixed(2));
      canvas.current.setZoom(nextScale);
      scale.current = nextScale;
      // ruler1.current.api.setScale(nextScale);
      handleScroll(e, nextScale);
      console.log(e);
      // ruler1.current.api.setPos({x: -239 + screensRect.left + e.deltaY*50, y: (-400 + screensRect.top)/scale.current});
    }
  }

  const handleScroll = (e, nextScale) => {
    e.preventDefault();
    const screensRect = document.querySelector('.upper-canvas').getBoundingClientRect();
    console.log((-239 + screensRect.left)/scale.current, (-400 + screensRect.top)/scale.current);
    if (!nextScale) {
      ruler1.current.api.setPos({x: (-239 + screensRect.left)/scale.current, y: (-400 + screensRect.top)/scale.current});
    }
    // ruler1.current.api.setPos({y: (-400 + screensRect.top)/scale});
    // canvas.current.remove(rect.current);
    // if (!initX.current && !initY.current) {
    //   initX.current = screensRect.left;
    //   initY.current = screensRect.top;
    // }
    // rect.current.set('left', rect.current.get('left') - (initX.current - screensRect.left));
    // rect.current.set('top', rect.current.get('top') - (initY.current - screensRect.top));
    // initX.current = screensRect.left;
    // initY.current = screensRect.top;
    // canvas.current.add(rect.current);
    if(!nextScale) {
      document.querySelector('#fullGrid').setAttribute('transform',`translate(${(-239 + screensRect.left)/scale.current}, ${(-120 + screensRect.top)/scale.current})`);
    }
    // const sc = nextScale || 1;
    const canvasRect = document.querySelector('#canvasRect');
    if (!nextScale) {
      canvasRect.transform.baseVal.getItem(0).setTranslate(561 + screensRect.left, screensRect.top); 
    } else {
      canvasRect.transform.baseVal.getItem(0).setTranslate(561 + e.x, e.y);
      canvasRect.transform.baseVal.getItem(1).setScale(nextScale, nextScale);
    }
    updateObjects();
  }

  const updateGrid = () => {
    const screensRect = document.querySelector('.upper-canvas').getBoundingClientRect();
    if (gridGroup.current) {
      canvas.current.remove(gridGroup.current);
    }
    const options = {
      distance: 10,
      width: canvas.current.width,
      height: canvas.current.height,
      param: {
        stroke: '#d8dfe8',
        strokeWidth: 1,
        selectable: false
      }
    };
    const gridLen = options.width / options.distance;
    const groupArray = [];

    for (let i = 0; i < gridLen; i++) {
      if (i%4 !== 0) {
        continue;
      }
      const distanceH = i * options.distance + screensRect.left,
        distanceV = i * options.distance + screensRect.top,
        horizontal = new fabric.Line([distanceH+1, 0, distanceH+1, options.width], options.param),
        vertical = new fabric.Line([0, distanceV+21, options.width, distanceV+21], options.param);
        horizontal.bringForward();
        vertical.bringForward();
        groupArray.push(horizontal);
        groupArray.push(vertical);
    };
    gridGroup.current = new fabric.Group(groupArray);
    canvas.current.add(gridGroup.current);
  }

  const updateObjects = () => {
    const screensRect = document.querySelector('.upper-canvas').getBoundingClientRect();
    const allObjects = canvas.current.getObjects();
    allObjects.forEach(object => {
      let left = -239 + screensRect.left,
        top = -120 + screensRect.top;
      if (object.get('initLeft') && object.get('initTop')) {
        left += object.get('initLeft');
        top += object.get('initTop');
      }
      object.set('left', left);
      object.set('top', top);
    });
  }

  const handleMouseDown = e => {
    const screens = document.querySelector('#screens');
    screens.style.zIndex = -1;
    return false;
  }

  return (
    <div ref={drop} className='dropzone-editor'>
      <div id="svgStr" style={{'backgroundColor': '#808d9c', position: 'absolute', height: '1400px', width: '2880px'}}>
        <svg style={{position: 'absolute', top: '25px', left: '-374px'}} width="4000px" height="2000px" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              {/* <rect width="80" height="80" fill="url(#smallGrid)"/> */}
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d8dfe8" strokeWidth="1"/>
            </pattern>
          </defs>
          <g id='canvasRect' transform="translate(800, 100), scale(1)">
            <rect width={`${canvasSize.width}px`} height={`${canvasSize.height}px`} fill={canvasSize.color}/>
            {/* <rect width="400px" height="400px" fill="url(#grid)"/> */}
          </g>
          <g id='fullGrid' transform="translate(0, -20)">
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