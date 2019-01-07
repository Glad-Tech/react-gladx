# react-gladx

[![NPM](https://img.shields.io/npm/v/react-gladx.svg)](https://www.npmjs.com/package/react-gladx) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Don't you dare say it! Don't you dare say that state management is NOT what the Context API was intended for, mmkay.
-----
If you're like me, then you are fed up with the boilerplate code Redux requires to do even the most simple of tasks. This module
 intends to help solve problem. 

> Default loading and error components

> Built in array normalization 

> Access and update the store from any component 

> Ajax components to  

> Single Store  



## Install

```bash
npm install --save react-gladx
```

## Usage

Wrap your app in the `GladX` component.
```jsx
import ReactDOM from 'react-dom'
import {GladX} from 'react-gladx'
import App from './App'

ReactDOM.render(
  <GladX
    initialState={initialState}
    post={post}
    get={get}
    loader={<LoadingComponent />}
    failure={(error) => <ErrorComponent />}
    children={<App />}
  />
  , document.getElementById('root'));
```


Utilize the `Ajax` component for rendering fetching and rendering a single component or list.

```jsx
import {Ajax, REQUEST_METHODS} from 'react-gladx'

<Ajax storeProp={'users'} 
      requestMethod={REQUEST_METHODS.GET}
      content={result => <Users keys={result.keys} data={result.data}/> }/>
```

Utilize the `AjaxButton` component to execute actions that update store data. 

```jsx
import {AjaxButton, REQUEST_METHODS, STORE_ACTIONS} from 'react-gladx'

<AjaxButton 
  storeProp={'users'}
  endpoint={'user/add'}
  action={STORE_ACTIONS.ADD}
  onRequestSuccess={()=>this.setState({hide})}
  requestData={{name:'Bob'}}
  loader={<Button loading={true}/>}
  content={executeRequest =><Button loading={false} onClick={executeRequest} />} />
```


Access the store/context using the `GladXContext` consumer. 

```jsx
import {GladXContext} from 'react-gladx'

<GladXContext.Consumer>
  {({actions, store, requestMethods, defaultComponents}) => <Component/>}
</GladXContext.Consumer>
```

# API

> GladX Component

property | type| required | usage
------------ | ------------- | ----------- | ----------
initialState | object |  | Same concept as Redux's initial state.
failure | function |  | Function intended to return a component to be rendered in case of failure. 
loader | component |  | Component to be rendered while in `loading` state.
get | promise |  | Ajax request. Should return data to be used when updating the store.
post | promise |  | Ajax request. Should return data to be used when updating the store.

> Ajax Component

property | type:default | required | usage
------------ | ------------- | ----------- | ----------
storeProp | string:null | | Ajax method GET/POST
endpoint | string:`storeProp`  | | /users/delete/`{id}`
requestData | any:null |  | Data to be used in ajax request 
requestMethod | string:POST |  | Ajax method GET/POST
action | string:UPDATE |  | Ajax method GET/POST
loader | string:null |  | Override default loader.
failure | function:null |  | Override default failure.
defaultLoading | string:null |  | Ajax method GET/POST
maxDuration | string:null |  | Ajax method GET/POST
onRequestError | string:null |  | Ajax method GET/POST
onRequestSuccess | string:null |  | Ajax method GET/POST
allowRetry | string:null |  | Ajax method GET/POST
executeRequestOnMount | string:null |  | Ajax method GET/POST




## License

MIT © [GLADiator-42](https://github.com/GLADiator-42)
