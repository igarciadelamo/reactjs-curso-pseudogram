import React, { Component } from 'react';
import firebase from 'firebase';

import FileUpload from './FileUpload';
import './App.css';

class App extends Component {

  constructor(){
    super();
    this.state = {
      user: null,
      pictures : []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user});
    });

    firebase.database().ref(`pictures`).on(`child_added`, snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
  }

  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesion`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout(){
    firebase.auth().signOut()
      .then(console.log(`El usuario ha cerrado sesion`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleUpload(event){
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);
  
    task.on(
      `state_changed`, 
      snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
          uploadValue : percentage
        });
      },
      error => {
        console.log(`Error ${error.code}: ${error.message}`)
      },
      () => {
        const record = {
          image: task.snapshot.downloadURL,
          photoURL: this.state.user.photoURL,
          displayName : this.state.user.displayName
        };
        const dbRef = firebase.database().ref(`pictures`);
        const newPicture = dbRef.push();
        newPicture.set(record);
      }
    );
  }
  
  renderLoginButton() {
    if(this.state.user){
      return (
        <div>
          <img width="200" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {}!</p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload onUpload={this.handleUpload} />

          {
            this.state.pictures.map(picture => (
              <div className="App-element">
                <img src={picture.image} alt="" width="600"/>
                <br/>
                <img src={picture.photoURL} alt={picture.displayName} width="30" />
                <span>Subido por {picture.displayName}</span>
              </div>
            )).reverse()
          }

        </div>
      );

    }else{
      return(
        <button onClick={this.handleAuth}>Login con Google</button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Pseudogram</h2>
        </div>
        <p className="App-intro">
          {this.renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
