import React from 'react'
import './App.css'
import {rgbDecTorgbHex} from './helperFunctions'
import Sound from 'react-sound'
import FireworksAudio from './assets/trimmedAudio.mp3'

let updateSparkle = (ax, ay, bx, by, op1, op2, sparkle) => {
  if (op1)
    sparkle.x += Math.floor(Math.random() * ax) + bx
  else 
    sparkle.x -= Math.floor(Math.random() * ax) + bx
  
  if (op2)
    sparkle.y += Math.floor(Math.random() * ay) + by
  else
    sparkle.y -= Math.floor(Math.random() * ay) + by
}

class App extends React.Component {
  state = { 
    sparkles: [], 
    path: [], 
    sliderRedX: 240,
    sliderGreenX: 230,
    sliderBlueX: 240
  }

  counter = 0
  coordCounter = 0
  isPainting = false
  line = []
  prevPos = {offsetX: 0, offsetY: 0}

  componentDidMount() {
    setInterval(this.update, 60)
    this.audio = new Audio(FireworksAudio)
    this.audio.volume = 0.5
    this.audio.addEventListener('ended', () => {
      this.currentTime = 0
      this.audio.play()
    }, false)
    this.audio.play()
    // document.body.addEventListener('touchstart', this.preventMotion, false)
    // document.body.addEventListener('touchmove', function() {})
    // window.addEventListener('touchmove', function() {})
    document.addEventListener('touchmove', function(e) { e.preventDefault() }, { passive: false })
  }

  onMouseDown = (e) => { 
    this.sparklerOn = true
    this.onMouseMove(e)
  }

  onMouseUp = () => { this.sparklerOn = false }

  update = () => {
    let updatedSparkles = []
    this.state.sparkles.forEach((sparkleArray) => {
      let updatedSparklesArray = []
      sparkleArray.forEach((sparkle, i) => {
        if (sparkle.quadrant === 1)           // top right 1
          updateSparkle(3, 3, 5, 2, true, true, sparkle)
        else if (sparkle.quadrant === 2)      // top right 2
          updateSparkle(3, 3, 2, 5, true, true, sparkle)
        else if (sparkle.quadrant === 3)      // top left 1
          updateSparkle(3, 3, 5, 2, false, true, sparkle)
        else if (sparkle.quadrant === 4)      // top left 2
          updateSparkle(3, 3, 2, 5, false, true, sparkle)
        else if (sparkle.quadrant === 5)      // bottom left 1
          updateSparkle(3, 3, 5, 2, false, false, sparkle)
        else if (sparkle.quadrant === 6)      // bottom left 2
          updateSparkle(3, 3, 2, 5, false, false, sparkle)
        else if (sparkle.quadrant === 7)      // bottom right 1
          updateSparkle(3, 3, 5, 2, true, false, sparkle)
        else                                  // bottom right 2
          updateSparkle(3, 3, 2, 5, true, false, sparkle)

        if (sparkle.quadrant >= 5 &&
          sparkle.quadrant <= 6 &&
          sparkle.counter >= sparkle.length - 6)
          updateSparkle(4, 4, 0, 3, true, true, sparkle)
        else if (sparkle.quadrant >= 7 &&
          sparkle.quadrant <= 8 &&
          sparkle.counter >= sparkle.length - 6)
          updateSparkle(4, 4, 0, 3, false, true, sparkle)

        let {r, g, b} = sparkle.color
        if (r > g && r > b)
          sparkle.color.r = Math.min(255, sparkle.color.r + 15)
        else if (g > r && g > b)
          sparkle.color.g = Math.min(255, sparkle.color.g + 15)
        else
          sparkle.color.b = Math.min(255, sparkle.color.b + 15)
        // sparkle.color.r = Math.min(255, sparkle.color.r + 15)
        // sparkle.color.g = Math.min(255, sparkle.color.g + 15)
        // sparkle.color.b = Math.min(255, sparkle.color.b + 15)
        
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
      let r = Math.floor(Math.random() * 255), g = Math.floor(Math.random() * 255), b = Math.floor(Math.random() * 255)
      for (let i = 0; i < 32; i++) {
        let newSparkleParticle = {
          x: e.type === 'mousedown' || e.type === 'mousemove' ? e.pageX : e.touches[0].pageX,
          y: e.type === 'mousedown' || e.type === 'mousemove' ? e.pageY : e.touches[0].pageY,
          // color: {r: this.state.sliderRedX, g: this.state.sliderGreenX, b: this.state.sliderBlueX},
          color: {r, g, b},
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
        {/* <Slider
          axis="x"
          x={this.state.sliderRedX}
          xmax={255}
          className="red-slider"
          onChange={({ x }) => this.setState({sliderRedX: x})}
          styles={{
            track: {
              backgroundColor: 'black'
            },
            active: {
              backgroundColor: 'red'
            },
            thumb: {
              width: 19,
              height: 19
            }
          }}
        />
        <br />
        <Slider
          axis="x"
          x={this.state.sliderGreenX}
          xmax={255}
          className="green-slider"
          onChange={({ x }) => this.setState({sliderGreenX: x})}
          styles={{
            track: {
              backgroundColor: 'black'
            },
            active: {
              backgroundColor: 'green'
            },
            thumb: {
              width: 19,
              height: 19
            }
          }}
        />
        <br />
        <Slider
          axis="x"
          x={this.state.sliderBlueX}
          xmax={255}
          className="blue-slider"
          onChange={({ x }) => this.setState({sliderBlueX: x})}
          styles={{
            track: {
              backgroundColor: 'black'
            },
            active: {
              backgroundColor: 'blue'
            },
            thumb: {
              width: 19,
              height: 19
            }
          }}
        /> */}
        
        {/* <DrawArea /> */}
      </div>
    )
  }
}

export default App
