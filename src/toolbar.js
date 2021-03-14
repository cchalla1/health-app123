import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import CategoryIcon from '@material-ui/icons/Category';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import OpacityIcon from '@material-ui/icons/Opacity';
import CropIcon from '@material-ui/icons/Crop';
import FlipIcon from '@material-ui/icons/Flip';
import FlipToFrontIcon from '@material-ui/icons/FlipToFront';
import StarIcon from '@material-ui/icons/Star';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles(theme => ({
  iconButton: {
    display: "flex",
    flexDirection: "column",
    maxWidth: '35px'
  },
  root: {
    padding: '7px',
    verticalAlign: 'unset'
  },
  rotate: {
    transform: 'rotate(90deg)'
  },
  gridRoot: {
    width: 250,
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: 'white',
    boxShadow: '1px 1px 30px 4px grey',
    borderRadius: '5px',
    padding: '10px 5px 5px 5px'
  },
  input: {
    width: 42,
    border: '1px solid grey'
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%) scale(3)`,
  };
}

function Toolbar({activeObject, canvas, canvasSize, setCanvasSize}) {

  const [opacityValue, setOpacityValue] = useState(null);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [bringFront, setBringFront] = useState(true);
  const [showOpacity, setShowOpacity] = useState(false);
  const [showCanvasSize, setShowCanvasSize] = useState(false);
  const [showCanvasColor, setShowCanvasColor] = useState(false);
  const [undoArray, setUndoArray] = useState([]);
  const [redoArray, setRedoArray] = useState([]);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const imgUrl = useRef(null);

  const classes = useStyles();

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <img src={imgUrl.current} style={{width: '100%', height: '100%'}}/>
    </div>
  );

  useEffect(() => {
    if (activeObject && activeObject.length > 0) {
      setShowOpacity(false);
      setOpacityValue(Math.round((activeObject[0].opacity)*100));
    }
  }, [activeObject, canvas]);

  const handleOpen = () => {
    imgUrl.current = canvas.toDataURL({
      format: 'png',
      quality: 0.8
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSliderChange = (event, newValue) => {
    const prevVal = activeObject[0].opacity;
    setOpacityValue(newValue);
    activeObject[0].set({'opacity': newValue/100});
    canvas.renderAll();
    const [...tempArray] = undoArray;
    tempArray.push({object: activeObject[0], prop: {'opacity': activeObject[0].opacity}, prevProp: {'opacity': prevVal}});
    setUndoArray(tempArray);
  };

  const handleOpacityChange = (event) => {
    const prevVal = activeObject[0].opacity;
    setOpacityValue(event.target.value === '' ? '' : Number(event.target.value));
    activeObject[0].set({'opacity': Number(event.target.value)/100});
    canvas.renderAll();
    const [...tempArray] = undoArray;
    tempArray.push({object: activeObject[0], prop: {'opacity': activeObject[0].opacity}, prevProp: {'opacity': prevVal}});
    setUndoArray(tempArray);
  }

  const handleOpacity = () => {
    setShowOpacity(!showOpacity);
  }

  const handleFlipHorizontal = () => {
    const prevVal = activeObject[0].flipX;
    activeObject[0].set({flipX: !flipX});
    setFlipX(!flipX);
    canvas.renderAll();
    const [...tempArray] = undoArray;
    tempArray.push({object: activeObject[0], prop: {'flipX': activeObject[0].flipX ? true : false}, prevProp: {'flipX': prevVal}});
    setUndoArray(tempArray);
  }

  const handleFlipVertical = () => {
    const prevVal = activeObject[0].flipY;
    activeObject[0].set({flipY: !flipY});
    setFlipY(!flipY);
    canvas.renderAll();
    const [...tempArray] = undoArray;
    tempArray.push({object: activeObject[0], prop: {'flipY': activeObject[0].flipY ? true : false}, prevProp: {'flipY': prevVal}});
    setUndoArray(tempArray);
  }

  const handleArrangeOrder = () => {
    bringFront ? activeObject[0].bringToFront() : canvas.sendToBack(activeObject[0]);
    setBringFront(false);
  }

  const handleCanvasSize = () => {
    setShowCanvasSize(!showCanvasSize);
  }

  const handleWidthChange = (e) => {
    setCanvasSize({...canvasSize, width: Number(e.target.value)});
  }

  const handleHeightChange = (e) => {
    setCanvasSize({...canvasSize, height: Number(e.target.value)});
  }

  const handleCanvasColor = () => {
    setShowCanvasColor(!showCanvasColor);
  }

  const handleColorChange = e => {
    setCanvasSize({...canvasSize, color: e.target.value});
  }

  const handleUndo = () => {
    const [...tempUndoArray] = undoArray;
    const recentChange = tempUndoArray.pop();
    setUndoArray(tempUndoArray);
    const [...tempRedoArray] = redoArray;
    tempRedoArray.push(recentChange);
    setRedoArray(tempRedoArray);
    recentChange.object.set(recentChange.prevProp);
    canvas.renderAll();
  }
  const handleRedo = () => {
    const [...tempRedoArray] = redoArray;
    const recentChange = tempRedoArray.pop();
    setRedoArray(tempRedoArray);
    const [...tempUndoArray] = undoArray;
    tempUndoArray.push(recentChange);
    setUndoArray(tempUndoArray);
    recentChange.object.set(recentChange.prop);
    canvas.renderAll();
  }

  const handlePreview = () => {
    const img = canvas.toDataURL({
      format: 'png',
      multiplier: 1,
      left: 800,
      top: 100,
      width: canvasSize.width,
      height: canvasSize.height
    });

    const win = window.open(img);
    // win.document.body.innerHTML = `<img src=${img} />`
    win.document.write('<iframe src="' + img + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
    win.focus();
  }

  return (
    <div className='dropzone-toolbar'>
      <div className='group-icons'>
        {undoArray.length === 0 && 
          <IconButton aria-label="undo" classes={{ label: classes.iconButton, root: classes.root }} disabled onClick={handleUndo}>
            <UndoIcon />
            <div style={{fontSize: '0.6rem'}}>Undo</div>
          </IconButton>
        }
        {undoArray.length > 0 && 
          <IconButton aria-label="undo" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleUndo}>
            <UndoIcon />
            <div style={{fontSize: '0.6rem'}}>Undo</div>
          </IconButton>
        }
        {redoArray.length === 0 && 
          <IconButton aria-label="redo" classes={{ label: classes.iconButton, root: classes.root }} disabled onClick={handleRedo}>
            <RedoIcon />
            <div style={{fontSize: '0.6rem'}}>Redo</div>
          </IconButton>
        }
        {redoArray.length > 0 && 
          <IconButton aria-label="redo" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleRedo}>
            <RedoIcon />
            <div style={{fontSize: '0.6rem'}}>Redo</div>
          </IconButton>
        }
        <IconButton aria-label="insert line" classes={{ label: classes.iconButton, root: classes.root }}>
          <LinearScaleIcon />
          <div style={{fontSize: '0.6rem'}}>Insert Line</div>
        </IconButton>
        <IconButton aria-label="insert shape" classes={{ label: classes.iconButton, root: classes.root }}>
          <CategoryIcon />
          <div style={{fontSize: '0.6rem'}}>Insert Shape</div>
        </IconButton>
        <IconButton aria-label="insert text" classes={{ label: classes.iconButton, root: classes.root }}>
          <FormatShapesIcon />
          <div style={{fontSize: '0.6rem'}}>Insert Text</div>
        </IconButton>
      </div>
      <div className='icons-border'></div>
      <div className='group-icons'>
        <IconButton aria-label="insert canvas resize" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleCanvasSize}>
          <SettingsOverscanIcon />
          <div style={{fontSize: '0.6rem'}}>Canvas Size</div>
        </IconButton>
        {showCanvasSize && 
          <div className={classes.gridRoot}>
            <Typography id="input-slider" gutterBottom>
              Canvas Size
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                Width
                <Input
                  value={canvasSize.width}
                  className={classes.input}
                  margin="dense"
                  onChange={handleWidthChange}
                  inputProps={{
                    type: 'text',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
              <Grid item>
                Height
                <Input
                  value={canvasSize.height}
                  className={classes.input}
                  margin="dense"
                  onChange={handleHeightChange}
                  inputProps={{
                    type: 'text',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
            </Grid>
          </div>
        }
        <IconButton aria-label="insert canvas color" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleCanvasColor}>
          <FormatColorFillIcon />
          <div style={{fontSize: '0.6rem'}}>Canvas Color</div>
        </IconButton>
        {showCanvasColor && 
          <div className={classes.gridRoot}>
            <Typography id="input-slider" gutterBottom>
              Canvas Color
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                Color
                <Input
                  value={canvasSize.color}
                  className={classes.input}
                  margin="dense"
                  onChange={handleColorChange}
                  inputProps={{
                    type: 'text',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
            </Grid>
          </div>
        }
      </div>
      {activeObject && activeObject.length > 0 &&
        <div className='icons-border'></div>
      }
      {activeObject && activeObject.length > 0 &&
        <div className='group-icons'>
          <IconButton aria-label="insert canvas resize" classes={{ label: classes.iconButton, root: classes.root }}>
            <FilterNoneIcon />
            <div style={{fontSize: '0.6rem'}}>Select Same Icons</div>
          </IconButton>
        </div>
      }
      {activeObject && activeObject.length > 0 &&
        <div className='icons-border'></div>
      }
      {activeObject && activeObject.length > 0 &&
        <div className='group-icons'>
          <IconButton aria-label="insert canvas color" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleOpacity}>
            <OpacityIcon />
            <div style={{fontSize: '0.6rem'}}>Opacity</div>
          </IconButton>
          {showOpacity && 
            <div className={classes.gridRoot}>
              <Typography id="input-slider" gutterBottom>
                Opacity
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={typeof opacityValue === 'number' ? opacityValue : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                  />
                </Grid>
                <Grid item>
                  <Input
                    value={opacityValue}
                    className={classes.input}
                    margin="dense"
                    onChange={handleOpacityChange}
                    inputProps={{
                      step: 10,
                      min: 0,
                      max: 100,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          }
          <IconButton aria-label="insert canvas color" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleOpen}>
            <CropIcon />
            <div style={{fontSize: '0.6rem'}}>Crop</div>
          </IconButton>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
        </div>
      }
      {activeObject && activeObject.length > 0 &&
        <div className='icons-border'></div>
      }
      {activeObject && activeObject.length > 0 &&
        <div className='group-icons'>
          <IconButton aria-label="insert canvas color" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleFlipHorizontal}>
            <FlipIcon />
            <div style={{fontSize: '0.6rem'}}>Flip Horizontal</div>
          </IconButton>
          <IconButton aria-label="insert canvas color" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleFlipVertical}>
            <FlipIcon classes={{ root: classes.rotate }} />
            <div style={{fontSize: '0.6rem'}}>Flip Vertical</div>
          </IconButton>
          <IconButton aria-label="insert canvas color" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleArrangeOrder}>
            <FlipToFrontIcon />
            <div style={{fontSize: '0.6rem'}}>Arrange Order</div>
          </IconButton>
          <IconButton aria-label="insert canvas resize" classes={{ label: classes.iconButton, root: classes.root }}>
            <SettingsOverscanIcon />
            <div style={{fontSize: '0.6rem'}}>Scale & Resize</div>
          </IconButton>
        </div>
      }
      {activeObject && activeObject.length > 0 &&
        <div className='icons-border'></div>
      }
      {activeObject && activeObject.length > 0 &&
        <div className='group-icons'>
          <IconButton aria-label="insert canvas resize" classes={{ label: classes.iconButton, root: classes.root }}>
            <StarIcon />
            <div style={{fontSize: '0.6rem'}}>Favorite</div>
          </IconButton>
        </div>
      }
      <div className='group-icons'>
        <IconButton aria-label="insert canvas color" classes={{ label: classes.iconButton, root: classes.root }} onClick={handleOpen}>
            <CropIcon />
            <div style={{fontSize: '0.6rem'}}>Preview</div>
          </IconButton>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
        </div>
    </div>
  )
}

export default Toolbar;