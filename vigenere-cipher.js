const fs = require('fs')
const path = require('path')

const filename = 'data.json'
const filepath = path.join(__dirname, filename)

let alphabet = 'abcdefghijklmnopqrstuvwxyz'
alphabet = alphabet.toUpperCase()

if (!fs.existsSync(filepath)) {
  const data = {}

  for (i = 0; i < alphabet.length; i++) {
    data[i] = alphabet[i]
    data[alphabet[i]] = i
  }

  const filedata = JSON.stringify(data, null, 2)
  fs.writeFileSync(filepath, filedata)
}

const filedata = fs.readFileSync(filepath)
const data = JSON.parse(filedata)

const checkKey = (key) => {
  if (key == '') {
    return {
      error: true,
      message: 'Error, key cannot be empty.'
    }
  }

  if (key.match(/^[A-Z]+$/) == null) {
    return {
      error: true,
      message: 'Error, the key can only accept the alphabet.'
    }
  }

  return {
    error: false,
    message: ''
  }
}

const algEncrypt = (ch_key, ch_text) => {
  const val_key = data[ch_key]
  const val_text = data[ch_text]

  const val_result = (val_key + val_text) % alphabet.length

  const ch_result = data[val_result]

  return ch_result
}

const algDecrypt = (ch_key, ch_text) => {
  const val_key = data[ch_key]
  const val_text = data[ch_text]

  let val_result = (val_text - val_key)

  if (val_result < 0) {
    val_result += alphabet.length
  }


  const ch_result = data[val_result]

  return ch_result
}

const encrypt = ({key, text}) => {
  key = key.toUpperCase()
  text = text.toUpperCase()

  const { error, message } = checkKey(key)

  if (error) {
    return message
  }
  
  let itr_key = 0
  let result = ''

  for (i = 0; i < text.length; i++) {
    const ch_text = text[i]
    let ch_key = ch_text
    let ch_result = ch_text

    if (data[ch_text] != undefined && !Number.isInteger(Number.parseInt(ch_text))) {
      const j = itr_key % key.length
      ch_key = key[j]
      itr_key++

      ch_result =  algEncrypt(ch_key, ch_text)
    }

    result += ch_result
  }

  return result
}

const decrypt = ({key, text}) => {
  key = key.toUpperCase()
  text = text.toUpperCase()

  const { error, message } = checkKey(key)

  if (error) {
    return message
  }
  
  let itr_key = 0
  let result = ''

  for (i = 0; i < text.length; i++) {
    const ch_text = text[i]
    let ch_key = ch_text
    let ch_result = ch_text

    if (data[ch_text] != undefined && !Number.isInteger(Number.parseInt(ch_text))) {
      const j = itr_key % key.length
      ch_key = key[j]
      itr_key++

      ch_result =  algDecrypt(ch_key, ch_text)
    }

    result += ch_result
  }

  return result
}

module.exports = { encrypt, decrypt }