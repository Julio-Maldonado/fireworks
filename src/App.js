import React from 'react'
import './App.css'
import * as colors from './constants'
import {rgbDecTorgbHex} from './helperFunctions'
// import {Polyline} from '../node_modules/react-polyline/src/index'

class App extends React.Component {
  state = { sparkles: [], path: [] }

  
  counter = 0
  isPainting = false
  line = []
  prevPos = {offsetX: 0, offsetY: 0}

  componentDidMount() {
    setInterval(this.update, 50)
    // document.body.addEventListener('touchstart', this.preventMotion, false);
    // document.body.addEventListener('touchmove', function() {});
    // window.addEventListener('touchmove', function() {});
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive:false });
    // document.body.addEventListener('scroll', this.preventMotion, false);
    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
    // this.updateCanvas()
  }

//   updateCanvas() {
//     const ctx = this.canvas.getContext('2d');
//     ctx.fillRect(0,0, 1000, 1000);
// }

  onMouseDown = (e) => { 
    this.sparklerOn = true
    const {offsetX, offsetY} = e
    this.isPainting = true
    this.prevPos = {offsetX, offsetY}
    this.onMouseMove(e)
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

  prevPos = { offsetX: 0, offsetY: 0 };

  onMouseMove = (e) => {
    if (this.sparklerOn === true) {
      let sparkleArray = []
      console.log(e.type)
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
        path: [...this.state.path, {x: e.pageX, y: e.pageY}]
      })

      const { offsetX, offsetY } = e;
      const offSetData = { offsetX, offsetY }
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      }
      this.line = this.line.concat(positionData)
      this.paint(this.prevPos, offSetData, this.userStrokeStyle);
    }
  }

  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }

  render () {
    return (
      <div className="App"
        onMouseDown={(e) => this.onMouseDown(e)}
        onMouseMove={(e) => this.onMouseMove(e)}
        onMouseUp={() => this.onMouseUp()}
        onTouchMove={(e) => this.onMouseMove(e)}
        onTouchStart={(e) => {this.onMouseDown(e)}} >
        {
          this.state.sparkles.map((sparkleArray) => {
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
        <canvas
          style={{width: '100%', height: '100%'}}
          ref={(ref) => (this.canvas = ref)}
          onMouseDown={(e) => this.onMouseDown(e)}
          onMouseMove={(e) => this.onMouseMove(e)}
          onMouseUp={() => this.onMouseUp()} />
      </div>
    )
  }
}

export default App
