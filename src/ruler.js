import React, { PureComponent } from 'react'
import ReactRuler from 'mb-sketch-ruler'
import DroppableZone from './droppable-zone-mb'

const thick = 40

export default class App extends PureComponent {
  state = {
    scale: 1, //658813476562495, //1,
    startX: 0,
    startY: 0,
    lines: {
      h: [],
      v: []
    },
    lang: 'en', // 中英文
    isShowRuler: true, // 显示标尺
    isShowReferLine: true, // 显示参考线
  }
  componentDidMount () {
    // 滚动居中
    this.$app.scrollLeft = this.$container.getBoundingClientRect().width / 2 - 300 // 300 = #screens.width / 2
    this.setState({ startX: -140})
    this.$container.addEventListener('wheel', this.handleWheel, {passive: false});
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.scale !== prevState.scale) {
      this.handleScroll()
    }
  }
  setAppRef = ref => this.$app = ref
  setContainerRef = ref => this.$container = ref

  handleScroll = () => {
    const screensRect = document.querySelector('#screens').getBoundingClientRect()
    const canvasRect = document.querySelector('.canvas-container').getBoundingClientRect()

    // 标尺开始的刻度
    const { scale, startX: prevStartX, startY: prevStartY } = this.state
    const startX = (screensRect.left + thick - canvasRect.left -1250) / scale
    const startY = (screensRect.top + thick - canvasRect.top - 141) / scale
    console.log(screensRect.top, canvasRect.left, startX, startY);
    this.setState({ startX, startY })
  }
  handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const nextScale = parseFloat(Math.max(0.2, this.state.scale - e.deltaY / 50).toFixed(2))
      this.setState({ scale: nextScale })
    }
  }
  handleLine = (lines) => {
    this.setState({ lines })
  }
  // 显示/影藏标尺
  handleShowRuler = () => {
    const { isShowRuler } = this.state
    this.setState({ isShowRuler: !isShowRuler })
  }
  // 显示/影藏参考线
  handleShowReferLine = () => {
    const { isShowReferLine } = this.state
    this.setState({ isShowReferLine: !isShowReferLine })
  }
  render () {
    const { scale, startX, startY, lines, isShowRuler, isShowReferLine, lang } = this.state
    const { h, v } = lines

    const rectWidth = 2500
    const rectHeight = 2000

    const canvasStyle = {
      width: rectWidth,
      height: rectHeight,
      scale: scale,
      startX,
      startY
    }
    const shadow = {
      x: 0,
      y: 0,
      width: rectWidth,
      height: rectHeight
    }

    return (
      <div className="wrapper">
        <div className="scale-value">{`scale: ${scale}`}</div>
        {
          isShowRuler &&
          <ReactRuler
            lang={lang}
            thick={thick}
            scale={scale}
            width={1420}
            height={691}
            startX={startX}
            startY={startY}
            shadow={shadow}
            horLineArr={h}
            verLineArr={v}
            handleLine={this.handleLine}
            cornerActive={true}
            onCornerClick={this.handleCornerClick}

            // 右键菜单props
            isOpenMenuFeature={true}
            handleShowRuler={this.handleShowRuler}
            isShowReferLine={isShowReferLine}
            handleShowReferLine={this.handleShowReferLine}
            onScroll={this.handleScroll}
          />
        }
        <DroppableZone canvasStyle={canvasStyle} scale={this.state.scale} />
        <div ref={this.setAppRef} id="screens" onScroll={this.handleScroll}>
          <div ref={this.setContainerRef} className="screen-container">
            {/* <div id="canvas" style={canvasStyle} /> */}
            {/* <DroppableZone canvasStyle={canvasStyle} scale={this.state.scale} /> */}
          </div>
        </div>
      </div>
    )
  }
}
