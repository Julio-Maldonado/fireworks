import React from 'react'
import './App.css'
import {List, Map} from 'immutable'

class DrawArea extends React.Component {
  state = {
    lines: new List(),
    isDrawing: false
  }

  update = () => {
    let {lines} = this.state
    if (lines.size !== 0) {
      this.setState(prevState => ({
        lines: this.state.lines.updateIn([0], line => line.delete(0))
      }))
      if (lines.get(0).size === 0)
        this.setState({ lines: lines.delete(0)})
    }
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp)
    document.addEventListener("touchend", this.handleMouseUp)
    setInterval(this.update, 20)
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp)
    document.removeEventListener("touchend", this.handleMouseUp)
  }

  handleMouseDown = (e) => {
    if (e.button === 0 || e.type === 'touchstart') {
      const point = this.relativeCoordinatesForEvent(e)
      // alert("handlemousedown")
      this.setState(prevState => ({
        lines: this.state.lines.push(new List([point])),
        isDrawing: true
      }))
    }
  }

  handleMouseMove = (e) => {
    if (this.state.isDrawing) {
      const point = this.relativeCoordinatesForEvent(e)
      let {lines} = this.state
      if (lines.size !== 0)
        this.setState(prevState =>  ({
          lines: lines.updateIn([lines.size - 1], line => line.push(point))
        })) 
    }
  }

  handleMouseUp = () => {
    this.setState({ isDrawing: false })
  }

  relativeCoordinatesForEvent = (e) => {
    console.log(e.type === 'mousedown' || e.type === 'mousemove' )
    const boundingRect = this.refs.drawArea.getBoundingClientRect()
    console.log(e.clientX - boundingRect.left)
    return new Map({
      x: e.type === 'mousedown' || e.type === 'mousemove' ? e.pageX - boundingRect.left : e.touches[0].pageX - boundingRect.left,
      y: e.type === 'mousedown' || e.type === 'mousemove' ? e.pageY - boundingRect.top : e.touches[0].pageY - boundingRect.top,
    })
  }

  render() {
    return (
      <div
        className="drawArea"
        ref="drawArea"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onTouchMove={this.handleMouseMove}
        onTouchStart={this.handleMouseDown}
      >
        <Drawing lines={this.state.lines} />
      </div>
    )
  }
}

function Drawing({ lines }) {
  return (
    <svg className="drawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} />
      ))}
    </svg>
  )
}

function DrawingLine({ line }) {
  const pathData = "M " +
    line
      .map(p => {
        return `${p.get('x')} ${p.get('y')}`
      })
      .join(" L ")

  return <path className="path" d={pathData} />
}

export default DrawArea