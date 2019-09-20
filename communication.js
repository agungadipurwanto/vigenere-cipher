const { ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const { encrypt, decrypt } = require('./vigenere-cipher')

module.exports = () => {
  ipcMain.on('encrypt-plaintext', (evt, arg) => {
    const encrypted_text = encrypt(arg)
    evt.reply('encrypt-plaintext-reply', encrypted_text)
  })

  ipcMain.on('encrypt-savetofile', (evt, arg) => {
    const filepath = dialog.showSaveDialogSync({
      title: 'Save Encrypted Text',
      defaultPath: path.join('Documents', 'ciphertext.txt'),
      filters: [
        { name: 'Text File', extensions: ['txt', 'TXT'] }
      ]
    })

    if (filepath != undefined) {
      fs.writeFileSync(filepath, arg)
      evt.reply('encrypt-savetofile-reply', 'File Saved.')
    }
  })

  ipcMain.on('encrypt-fileinput', (evt, arg) => {
    const filepath = dialog.showOpenDialogSync({
      title: 'Open Plaintext File',
      defaultPath: path.join('Documents', 'plaintext.txt'),
      filters: [
        { name: 'Text File', extensions: ['txt', 'TXT'] }
      ],
      properties: ['openFile']
    })

    if (filepath != undefined) {
      const contents = fs.readFileSync(filepath[0], 'utf-8')
      evt.reply('encrypt-fileinput-reply', {
        filepath: filepath[0],
        contents
      })
    }
  })

  ipcMain.on('decrypt-ciphertext', (evt, arg) => {
    const plaintext = decrypt(arg)
    evt.reply('decrypt-ciphertext-reply', plaintext)
  })
  
  ipcMain.on('decrypt-savetofile', (evt, arg) => {
    const filepath = dialog.showSaveDialogSync({
      title: 'Save Decrypted Text',
      defaultPath: path.join('Documents', 'plaintext.txt'),
      filters: [
        { name: 'Text File', extensions: ['txt', 'TXT'] }
      ]
    })

    if (filepath != undefined) {
      fs.writeFileSync(filepath, arg)
      evt.reply('decrypt-savetofile-reply', 'File Saved.')
    }
  })

  ipcMain.on('decrypt-fileinput', (evt, arg) => {
    const filepath = dialog.showOpenDialogSync({
      title: 'Open Ciphertext File',
      defaultPath: path.join('Documents', 'ciphertext.txt'),
      filters: [
        { name: 'Text File', extensions: ['txt', 'TXT'] }
      ],
      properties: ['openFile']
    })

    if (filepath != undefined) {
      const contents = fs.readFileSync(filepath[0], 'utf-8')
      evt.reply('decrypt-fileinput-reply', {
        filepath: filepath[0],
        contents
      })
    }
  })
}