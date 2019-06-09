import React from 'react'
// import logo from './logo.svg'
import './App.css'

const RED = 240
const GREEN = 230
const BLUE = 140
// sparkler

let decimalToHex = (num) => {
  // if num < 16, then append a 0 to properly convert to rgb value
  if ((num/16) === 0)
    return '0' + num.toString(16)
  return num.toString(16)
}

let rgbDecTorgbHex = (num1, num2, num3) => {
  return decimalToHex(num1) + decimalToHex(num2) + decimalToHex(num3)
}

/*
let newSparkle = {
  x: e.pageX,
  y: e.pageY,
  color: {r: 252, g: 0, b: 0},
  key: this.counter
}
*/

class App extends React.Component {
  state = {
    sparkles: [],
    x: 0,
    y: 0
  }

  counter = 0

  update = () => {
    let updatedSparkles = this.state.sparkles.map((sparkleArray) => {
      let counter = 0
      let updatedSparklesArray = []
      sparkleArray.forEach((sparkle) => {
        if (counter < 5) {
          counter++
          if (Math.floor(Math.random() * 2) === 0)
            sparkle.x += Math.floor(Math.random() * 3) + 2
          else
            sparkle.x -= Math.floor(Math.random() * 3) + 2
          
          if (Math.floor(Math.random() * 2) === 0)
            sparkle.y += Math.floor(Math.random() * 3) + 2
          else
            sparkle.y -= Math.floor(Math.random() * 3) + 2

        } else {
          if (Math.floor(Math.random() * 2) === 0)
            sparkle.x += Math.floor(Math.random() * 3) + 2
          else
            sparkle.x -= Math.floor(Math.random() * 3) + 2

          if (Math.floor(Math.random() * 2) === 0)
            sparkle.y += Math.floor(Math.random() * 3) + 2
          else
            sparkle.y -= Math.floor(Math.random() * 3) + 2

        }
        if (sparkle.counter !== sparkle.length)
          updatedSparklesArray.push(sparkle)
        sparkle.counter++
      })
      return updatedSparklesArray
    })
    this.setState({ sparkles: updatedSparkles})
  }

  componentDidMount() {
    console.log(window.innerHeight)
    console.log(window.innerWidth)
    setInterval(this.update, 50)
  }

  onMouseDown = () => {
    this.sparklerOn = true
  }

  onMouseMove = (e) => {
    if (this.sparklerOn === true) {
      let sparkleArray = []
      for (let i = 0; i < 5; i++) {
        let newSparkleParticle = {
          x: e.pageX + i,
          y: e.pageY + i,
          color: {r: RED, g: GREEN, b: BLUE},
          length: Math.floor(Math.random() * 15) + 10,
          counter: 0,
          key: this.counter
        }
        sparkleArray.push(newSparkleParticle)
        this.counter++
      }
      for (let i = 1; i < 5; i++) {
        let newSparkleParticle = {
          x: e.pageX - i,
          y: e.pageY - i,
          color: {r: RED, g: GREEN, b: BLUE},
          length: Math.floor(Math.random() * 15) + 10,
          counter: 0,
          key: this.counter
        }
        sparkleArray.push(newSparkleParticle)
        this.counter++
      }
      this.setState({
        x: e.pageX,
        y: e.pageY,
        sparkles: [...this.state.sparkles, sparkleArray]
      })
    }
  }

  onMouseUp = () => {
    this.sparklerOn = false
  }

  render () {
    return (
      <div className="App"
        onMouseDown={() => this.onMouseDown()}
        onMouseMove={(e) => this.onMouseMove(e)}
        onMouseUp={() => this.onMouseUp()}
        onMouseDownCapture={(e) => console.log(e.pageX, e.pageY)} >
        <div className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
        </div>
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
                    width: '1%',
                    height: '1%',
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
      </div>
    )
  }
}

export default App
