import React from 'react'
import './App.css'
import * as colors from './constants'
import {rgbDecTorgbHex} from './helperFunctions'
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
    setInterval(this.update, 20)
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp)
  }

  handleMouseDown = (e) => {
    if (e.button === 0 || e.type === 'touchstart') {
      const point = this.relativeCoordinatesForEvent(e)

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
    const boundingRect = this.refs.drawArea.getBoundingClientRect()
    return new Map({
      x: e.type === 'mousedown' || e.type === 'mousemove' ? e.clientX - boundingRect.left : e.touches[0].pageX - boundingRect.left,
      y: e.type === 'mousedown' || e.type === 'mousemove' ? e.clientY - boundingRect.top : e.touches[0].pageY - boundingRect.top,
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

class App extends React.Component {
  state = { sparkles: [], path: [] }

  
  counter = 0
  coordCounter = 0
  isPainting = false
  line = []
  prevPos = {offsetX: 0, offsetY: 0}

  componentDidMount() {
    setInterval(this.update, 50)
    // document.body.addEventListener('touchstart', this.preventMotion, false)
    // document.body.addEventListener('touchmove', function() {})
    // window.addEventListener('touchmove', function() {})
    document.addEventListener('touchmove', function(e) { e.preventDefault() }, { passive:false })
  }

  onMouseDown = (e) => { 
    this.sparklerOn = true
    this.onMouseMove(e)
  }
  
  relativeCoordinatesForEvent(e) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect()
    return new Map({
      x: e.clientX - boundingRect.left,
      y: e.clientY - boundingRect.top,
    })
  }

  onMouseUp = () => { this.sparklerOn = false }

  update = () => {
    let updatedSparkles = []
    this.state.sparkles.forEach((sparkleArray) => {
      let updatedSparklesArray = []
      sparkleArray.forEach((sparkle) => {
        if (sparkle.quadrant === 1) {         // top right 1
          sparkle.x += Math.floor(Math.random() * 3) + 5
          sparkle.y += Math.floor(Math.random() * 3) + 2
        } else if (sparkle.quadrant === 2) {  // top right 2
          sparkle.x += Math.floor(Math.random() * 3) + 2
          sparkle.y += Math.floor(Math.random() * 3) + 5
        } else if (sparkle.quadrant === 3) {  // top left 1
          sparkle.x -= Math.floor(Math.random() * 3) + 5
          sparkle.y += Math.floor(Math.random() * 3) + 2
        } else if (sparkle.quadrant === 4) {  // top left 2
          sparkle.x -= Math.floor(Math.random() * 3) + 2
          sparkle.y += Math.floor(Math.random() * 3) + 5
        } else if (sparkle.quadrant === 5) {  // bottom left 1
          sparkle.x -= Math.floor(Math.random() * 3) + 5
          sparkle.y -= Math.floor(Math.random() * 3) + 2
        } else if (sparkle.quadrant === 6) {  // bottom left 2
          sparkle.x -= Math.floor(Math.random() * 3) + 2
          sparkle.y -= Math.floor(Math.random() * 3) + 5
        } else if (sparkle.quadrant === 7) {  // bottom right 1
          sparkle.x += Math.floor(Math.random() * 3) + 5
          sparkle.y -= Math.floor(Math.random() * 3) + 2
        } else {                              // bottom right 2
          sparkle.x += Math.floor(Math.random() * 3) + 2
          sparkle.y -= Math.floor(Math.random() * 3) + 5
        }
        sparkle.color.r -= 10
        sparkle.color.g -= 10
        sparkle.color.b -= 5
        
        if (sparkle.counter++ !== sparkle.length)
          updatedSparklesArray.push(sparkle)
      })
      if (updatedSparklesArray.length !== 0)
        updatedSparkles.push(updatedSparklesArray)
    })
    this.setState({ sparkles: updatedSparkles})
  }

  onMouseMove = (e) => {
    if (this.sparklerOn === true) {
      let sparkleArray = []
      for (let i = 0; i < 32; i++) {
        let newSparkleParticle = {
          x: e.type === 'mousedown' || e.type === 'mousemove' ? e.pageX : e.touches[0].pageX,
          y: e.type === 'mousedown' || e.type === 'mousemove' ? e.pageY : e.touches[0].pageY,
          color: {r: colors.RED, g: colors.GREEN, b: colors.BLUE},
          length: Math.floor(Math.random() * 10) + 5,
          counter: 0,
          key: this.counter++,
          quadrant: i % 8 + 1
        }
        sparkleArray.push(newSparkleParticle)
      }
      this.setState({
        sparkles: [...this.state.sparkles, sparkleArray],
        path: [...this.state.path, {x: e.pageX, y: e.pageY, key: this.coordCounter++}]
      })
    }
  }

  render () {
    const {sparkles} = this.state
    return (
      <div className="App"
        ref="drawArea"
        onMouseDown={(e) => this.onMouseDown(e)}
        onMouseMove={(e) => this.onMouseMove(e)}
        onMouseUp={() => this.onMouseUp()}
        onTouchMove={(e) => this.onMouseMove(e)}
        onTouchStart={(e) => {this.onMouseDown(e)}} >
        {
          sparkles.map((sparkleArray) => {
            return (
              sparkleArray.map((sparkle) => {
                let color = rgbDecTorgbHex(sparkle.color.r, sparkle.color.g, sparkle.color.b)
                return (
                  <div
                    key={`sparkle${sparkle.key}`}
                    style={{
                    backgroundColor: `#${color}`,
                    borderRadius: 10,
                    width: '0.2%',
                    height: '0.2%',
                    color: '#fff',
                    position: 'absolute',
                    left: sparkle.x,
                    top: sparkle.y
                  }} />    
                )
              })
            )
          })
        }
        <DrawArea />
      </div>
    )
  }
}

export default App
