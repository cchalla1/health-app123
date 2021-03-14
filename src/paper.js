import Raphael from 'raphael';

let paper;
let delta;
let containerElement;
let isDown = false;
let downCoords = {};
let imgSet;
let isDragSet = false;
let dragRectElement;

function dragStart(x, y, e) {
  this.current_transform = this.transform();
  imgSet.rectBox.remove();
  imgSet.forEach(element => {
    element.rectBox.remove();
  })
}

function dragMove(dx, dy) {
  imgSet.rectBox.remove();
  const { x, y, width, height } = imgSet.getBBox();
  imgSet.rectBox = paper.rect(x, y, width, height);
  imgSet.forEach(element => {
    element.rectBox.remove();
    const { x, y, width, height } = element.getBBox();
    element.rectBox = paper.rect(x, y, width, height);
    element.transform(this.current_transform + 'T' + dx + ',' + dy);
  })
}

function dragEnd(e) {
  console.log('dragEnd');
  imgSet.rectBox.remove();
  this.current_transform = this.transform();
}

const handleCanvasMouseDown = e => {
  e.preventDefault();
  e.stopPropagation();
  downCoords.x = e.clientX - containerElement.offsetLeft;
  downCoords.y = e.clientY - containerElement.offsetTop;
  isDown = true;
  imgSet = paper.set();
}

const handleCanvasMouseMove = (e, ctx) => {
  if (!isDown) {
    return;
  }
  if(dragRectElement) {
    dragRectElement.remove();
  }
  e.preventDefault();
  e.stopPropagation();
  const width = Math.abs(e.clientX - containerElement.offsetLeft - downCoords.x);
  const height = Math.abs(e.clientY - containerElement.offsetTop - downCoords.y);
  let x;
  let y;
  if (e.clientX - containerElement.offsetLeft > downCoords.x) {
    x = downCoords.x;
    y = Math.min(e.clientY - containerElement.offsetTop, downCoords.y);
  } else {
    x = e.clientX - containerElement.offsetLeft;
    y = Math.min(e.clientY - containerElement.offsetTop, downCoords.y);
  }
  dragRectElement = paper.rect(x, y, width, height);
}

const handleCanvasMouseUp = (e, ctx) => {
  dragRectElement.remove();
  isDown = false;
  downCoords = {};
  if(imgSet.rectBox && imgSet.rectBox[0]) {
    imgSet.rectBox.remove();
  }
  const { x, y, width, height } = imgSet.getBBox();
  imgSet.rectBox = paper.rect(x, y, width, height);
  if (!isDragSet) {
    imgSet.drag(dragMove, dragStart, dragEnd);
    isDragSet = true;
  }
}

const attachHandlers = imgElement => {
  let removeBox = true;
  let isDown = true;
  imgElement.hover(() => {
    if (imgElement.rectBox) {
      imgElement.rectBox.remove();
    }
    const { x, y, width, height } = imgElement.getBBox();
    imgElement.rectBox = paper.rect(x, y, width, height);
    // console.log('hovered');
    if(imgSet) {
      imgSet.push(imgElement);
      removeBox = false;
    }
  }, () => {
    if (removeBox) {
      imgElement.rectBox.remove();
      removeBox = true;
    }
  });

  imgElement.mousedown(e => {
    e.stopPropagation();
    // e.preventDefault();
    // imgElement.rectBox.remove();
    isDown = true;
  });

  // imgElement.mousemove(e => {
  //   e.stopPropagation();
  //   // e.preventDefault();
  //   if (isDown) {
  //     imgElement.rectBox.remove();
  //     const { x, y, width, height } = imgElement.getBBox();
  //     imgElement.rectBox = paper.rect(x, y, width, height);
  //   }
  // });

  imgElement.mouseup(e => {
    // e.stopPropagation();
    // e.preventDefault();
    // isDown = false;
  });
}

export const initialisePaper = (container) => {
  containerElement = container;
  paper = Raphael(container, '100%', '100%');
  container.addEventListener('mousedown', (e) => {
    if(e.currentTarget.className !== 'paper') {
      return;
    }
    handleCanvasMouseDown(e)
  });
  container.addEventListener('mousemove', (e) => {
    if(e.currentTarget.className !== 'paper') {
      return;
    }
    handleCanvasMouseMove(e)
  });
  container.addEventListener('mouseup', (e) => {
    if(e.currentTarget.className !== 'paper') {
      return;
    }
    handleCanvasMouseUp(e)
  });
  delta = container.getBoundingClientRect();
}

export const drawImage = (imgSrc, x = 10, y = 10) => {
  if (!paper) {
    return;
  }

  const imgElement = paper.image(imgSrc, x - delta.x, y - delta.y, 100, 100);
  attachHandlers(imgElement);
}
