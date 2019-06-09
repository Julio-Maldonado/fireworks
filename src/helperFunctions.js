let decimalToHex = (num) => {
// if num < 16, then append a 0 to properly convert to rgb value
if ((num/16) === 0)
    return '0' + num.toString(16)
return num.toString(16)
}

let rgbDecTorgbHex = (num1, num2, num3) => {
    return decimalToHex(num1) + decimalToHex(num2) + decimalToHex(num3)
}

export {decimalToHex, rgbDecTorgbHex}