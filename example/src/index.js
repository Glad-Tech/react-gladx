import React from 'react'
import ReactDOM from 'react-dom'
import "semantic-ui-css/semantic.min.css";
import {Loader, Message} from 'semantic-ui-react'
import {GladX} from 'react-gladx'
import App from './App'
import {USERS} from './StoreProps'

//ajax requests
function post(endpoint, postData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      if (endpoint.indexOf('delete') > -1) {
        resolve(postData)
      } else if (endpoint.indexOf('add') > -1) {
        resolve({...postData, id: getRandomInt(939393)})

      }

    }, 500)
  });
}
//ajax requests
function get(endpoint, postData) {

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(USER_DATA)
      , 1000)
  });
}


const initialState = {
  [USERS]: null
}


ReactDOM.render(
  <GladX
    initialState={initialState}
    post={post}
    get={get}
    loader={<Loader active/>}
    failure={(error) => <Message header={'Oops! An error has occurred.'} content={error.toString()}/>}
    children={<App />}
  />
  , document.getElementById('root'));




const USER_DATA = [
  {id: 12, name: 'Veronika Smith', company:'React Studios', title:'QA', link:'https://react.semantic-ui.com/images/avatar/large/veronika.jpg'},
  {id: 44, name: 'Jason Gladiator', company:'Glad Tech', title:'Software Engineer', link:'https://react.semantic-ui.com/images/avatar/large/jenny.jpg'},
]

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
