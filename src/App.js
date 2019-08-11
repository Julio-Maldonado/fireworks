import React from 'react'
import './App.css'
import {rgbDecTorgbHex} from './helperFunctions'
import FireworksAudio from './assets/trimmedAudio.mp3'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebookF';
import faInstagram from '@fortawesome/fontawesome-free-brands/faInstagram';
import faLinkedinIn from '@fortawesome/fontawesome-free-brands/faLinkedinIn';
import faEnvelope from '@fortawesome/fontawesome-free-regular/faEnvelope';

const data = [
	{
	  link: 'https://github.com/Julio-Maldonado',
	  label: 'Github',
	  icon: faGithub,
	},
	{
	  link: 'https://www.facebook.com/julio.maldonado.904',
	  label: 'Facebook',
	  icon: faFacebook,
	},
	{
	  link: 'https://www.instagram.com/_julio_maldonado/',
	  label: 'Instagram',
	  icon: faInstagram,
	},
	{
	  link: 'https://www.linkedin.com/in/juliom72/',
	  label: 'LinkedIn',
	  icon: faLinkedinIn,
	},
	{
	  link: 'mailto:julio.maldonado.guzman@gmail.com',
	  label: 'Email',
	  icon: faEnvelope,
	},
];

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
    sliderBlueX: 240,
  }

  counter = 0
  coordCounter = 0
  isPainting = false
  line = []
  prevPos = {offsetX: 0, offsetY: 0}

  componentDidMount() {
    document.title = "Fireworks"

    setInterval(this.update, 60)
    setInterval(() => this.fireworkFlags(true, false), 3000)
    setInterval(() => this.fireworkFlags(false, true), 3000)
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

  fireworkFlags = (americanFlag, mexicanFlag) => {
    let sparkleArray = []

    // MEXICAN FLAG
    // green color
    let xOffset = 64
    let yOffset = 128
    let INCREMENTER = 8
    let r = 0, g = 104, b = 71
    let wWidth = (window.innerWidth + Math.floor(Math.random() * window.innerWidth)) % (window.innerWidth - xOffset)
    let wHeight = (window.innerHeight + Math.floor(Math.random() * window.innerHeight)) % (window.innerHeight - xOffset)

    if (mexicanFlag) {
      for (let i = 0; i <= xOffset; i+=INCREMENTER) {
        for (let j = 0; j <= yOffset; j+=INCREMENTER) {
          let newSparkleParticle = {
            x: wWidth - xOffset + i,
            y: wHeight + j,
            color: {r, g, b},
            length: Math.floor(Math.random() * 10) + 5,
            counter: 0,
            key: this.counter++,
            quadrant: Math.floor(Math.random() * 8)
          }
          sparkleArray.push(newSparkleParticle)
        }
      }
      
      r = 255
      g = 255
      b = 255
      for (let i = 0; i <= xOffset; i+=INCREMENTER) {
        for (let j = 0; j <= yOffset; j+=INCREMENTER) {
          let newSparkleParticle = {
            x: wWidth + i,
            y: wHeight + j,
            color: {r, g, b},
            length: Math.floor(Math.random() * 10) + 5,
            counter: 0,
            key: this.counter++,
            quadrant: Math.floor(Math.random() * 8)
          }
          sparkleArray.push(newSparkleParticle)
        }
      }
  
      r = 206
      g = 17
      b = 38
      for (let i = 0; i <= xOffset; i+=INCREMENTER) {
        for (let j = 0; j <= yOffset; j+=INCREMENTER) {
          let newSparkleParticle = {
            x: wWidth + xOffset +  i,
            y: wHeight + j,
            color: {r, g, b},
            length: Math.floor(Math.random() * 10) + 5,
            counter: 0,
            key: this.counter++,
            quadrant: Math.floor(Math.random() * 8)
          }
          sparkleArray.push(newSparkleParticle)
        }
      } 
    }

    if (americanFlag) {
      // AMERICAN FLAG
      // blue
      wWidth = (window.innerWidth + Math.floor(Math.random() * window.innerWidth) + wWidth) % (window.innerWidth - xOffset)
      wHeight = (window.innerHeight + Math.floor(Math.random() * window.innerHeight) + wHeight) % (window.innerHeight - xOffset)

      r = 60
      g = 59
      b = 110

      // THIS DOES THE BLUE HALF
      for (let i = 0; i <= xOffset; i+=INCREMENTER) {
        for (let j = 0; j <= yOffset/2; j+=INCREMENTER) {
          let newSparkleParticle = {
            x: wWidth - xOffset + i,
            y: wHeight + j,
            color: {r, g, b},
            length: Math.floor(Math.random() * 10) + 5,
            counter: 0,
            key: this.counter++,
            quadrant: Math.floor(Math.random() * 8)
          }
          sparkleArray.push(newSparkleParticle)
        }
      }

      // white
      let red = { r: 178, g: 34, b: 52 }
      let white = { r: 255, g: 255, b: 255 }

      let flagCounter = 0
      for (let i = 0; i <= 2*xOffset; i+=INCREMENTER) {
        for (let j = 0; j <= yOffset/2; j+=INCREMENTER) {
          let newSparkleParticle = {
            x: wWidth + i,
            y: wHeight + j,
            color: flagCounter++ % 2 === 0 ? red : white,
            length: Math.floor(Math.random() * 10) + 5,
            counter: 0,
            key: this.counter++,
            quadrant: Math.floor(Math.random() * 8)
          }
          sparkleArray.push(newSparkleParticle)
        }
      }

      // red
      r = 178
      g = 34
      b = 52
      for (let i = 0; i <= 3*xOffset; i+=INCREMENTER) {
        for (let j = yOffset/2; j <= yOffset; j+=INCREMENTER) {
          let newSparkleParticle = {
            x: wWidth - xOffset +  i,
            y: wHeight + j,
            color: flagCounter++ % 2 === 0 ? red : white,
            length: Math.floor(Math.random() * 10) + 5,
            counter: 0,
            key: this.counter++,
            quadrant: Math.floor(Math.random() * 8)
          }
          sparkleArray.push(newSparkleParticle)
        }
      }
    }

    this.setState({
      sparkles: [...this.state.sparkles, sparkleArray],
      // path: [...this.state.path, {x: e.pageX, y: e.pageY, key: this.coordCounter++}]
    })
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
        // path: [...this.state.path, {x: e.pageX, y: e.pageY, key: this.coordCounter++}]
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
        <div id="footer">
          <ul className="icons">
              {data.map(s => (
                  <li key={s.label}>
                      <a href={s.link} target="_blank" rel="noopener noreferrer">
                          <FontAwesomeIcon icon={s.icon} />
                      </a>
                  </li>
              ))}
          </ul>
          <p className="copyright">
              <a href={"https://juliomaldonado.com"} target="_blank" rel="noopener noreferrer">
                  juliomaldonado.com
              </a>
          </p>
        </div>
      </div>
    )
  }
}

export default App
