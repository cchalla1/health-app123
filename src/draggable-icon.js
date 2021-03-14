import React, { useEffect } from 'react';
import { ItemTypes } from './constants';
import { useDrag } from 'react-dnd';
import {drawImage} from './paper';

function DraggableIcon({imgSrc}) {
  const [{isDragging}, drag] = useDrag(() => ({
    item: { type: ItemTypes.ICON, imgSrc },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        // console.log(monitor, monitor.getDifferenceFromInitialOffset(), monitor.getSourceClientOffset());
        // drawImage(item.imgSrc)
      }
    },
  }));

  useEffect(() => {
    // const screensRect = document.querySelector('#screens');
    // if(isDragging) {
    //   screensRect.style.zIndex = -1;
    // } else{
    //   screensRect.style.zIndex = 5;
    // }
  }, [isDragging])

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: '60px',
        height: '60px',
        cursor: 'move',
        display: 'inline-block',
        margin: '25px 15px 0px 15px',
        padding: '5px',
        border: '1px solid black'
      }}
    >
      <img
        style={{
          width: '100%',
          height: '100%',
          cursor: 'move',
        }}
        src={imgSrc}
      />
    </div>
  )
}

export default DraggableIcon;