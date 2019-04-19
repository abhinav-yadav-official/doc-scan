import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  constructor () {
    super();
    this.upload = this.upload.bind(this)
    this.updateEdit = this.updateEdit.bind(this)
    this.textRef = React.createRef()
    this.buttonRef = React.createRef()
    this.state = {text:""}
  }

  upload = e => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('img',file)
    this.send(formData)
  }

  send = data => {
    fetch('/api/tesseract',{
      mode: 'no-cors',
      method:"POST",
      headers:{
        'Accept': 'application/json'
      },
      body: data
    })
      .then(res => res.json())
      .then(res => {
        this.textRef.current.value = res.text
        this.update()
      });
  }

  update() {
    const file = new Blob([this.textRef.current.value.replace(/([^\r])\n/g, "$1\r\n")], {type: 'text/plain'})
    this.buttonRef.current.href = URL.createObjectURL(file);
    this.buttonRef.current.download = 'document.txt'
  }
  
  updateEdit = e => this.update()

  render() {
    return (
      <div>
        <h1>Document Scanner</h1>
        <label for="upload">Upload</label>
          <input id="upload" type="file" onChange={this.upload} accept="image/png, image/jpeg"/><br/>
          <textarea onChange={this.updateEdit} ref={this.textRef} rows="25" cols="75"></textarea><br/>
          <a ref={this.buttonRef}>Download</a>
      </div>
    );
  }
}
