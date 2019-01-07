
# react-gladx

[![NPM](https://img.shields.io/npm/v/react-gladx.svg)](https://www.npmjs.com/package/react-gladx) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Wouldn't it be nice if a component could execute an ajax request, render `loading`, `error`, and `success` states, and simultaneously update the application's store?
Fed up with the boilerplate code that many state management frameworks require to accomplish even the most simple of tasks? This package intends to 
help ease the pain by combining ideologies from multiple state management frameworks.   

# Features

> Easy setup

> Access and update the store from any component 

> Anti-boilerplate ajax components  

> Retry failed requests
  
> Auto array normalization 

> Single store

> Fast/slow network rendering options

## Install

```bash
npm install --save react-gladx
```

## Usage [(example project)](https://github.com/Glad-Tech/react-gladx/tree/master/example)

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
    failure={(error) => <ErrorComponent messageToUser={error.friendlyMessage} />}
    children={<App />}
  />
  , document.getElementById('root'));
```


Utilize `Ajax` for fetching and rendering components from the returned data. By default, ajax requests are executed in `onComponentDidMount` ONLY if no data exists for the `storeProp`. Use `executeRequestOnMount` to refresh store data.

```jsx
import {Ajax, REQUEST_METHODS} from 'react-gladx'

<Ajax storeProp={'users'} 
      requestMethod={REQUEST_METHODS.GET}
      content={result => <Users keys={result.keys} data={result.data}/> }/>
```

Utilize `AjaxButton` to execute actions that update store data. 

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

# Run the [example project](https://github.com/Glad-Tech/react-gladx/tree/master/example) for more usage details.


# API

> GladX Component

property | type| required | usage
------------ | ------------- | ----------- | ----------
initialState | object | [x] | Default state of store where the object's keys represent the data elements the app will using consuming.
failure | function | [x] | Function intended to return a component to be rendered in case of failure. 
loader | component | [x] | Component to be rendered while in the `loading` state.
get | promise | [x] | Ajax request. Should return data to be used when updating the store.
post | promise | [x] | Ajax request. Should return data to be used when updating the store.

> Ajax & AjaxButton Component

property | type:default | required | usage
------------ | ------------- | ----------- | ----------
storeProp | string:null | [x] | Used when determining which property to update in the store. Ex. `users` will update `store.users`  
endpoint | string:`storeProp`  | [x] | Endpoint for the ajax request Ex. /users/delete/`{id}`
requestData | any:null |  | Data to be used in ajax request 
requestMethod | string:POST |  | Ajax method type Ex. GET/POST
action | string:UPDATE |  | Update method when ajax request has completed successfully Ex. UPDATE,ADD,DELETE
loader | string:null |  | Override default loader component.
failure | function:null |  | Override default failure function.
maxDuration | integer:null |  | Maximum amount of milliseconds until `loader` component is rendered when executing ajax request. Ex. `500` spinner will not render if the ajax request finishes in less than half a second
onRequestError | function:null |  | Callback when ajax request succeeds
onRequestSuccess | function:null |  | Callback when ajax request fails
allowRetry | bool:null |  | Passes `executeRequest` to `failure` function allowing for customization of retry functionality.
executeRequestOnMount | bool:null |  | For `Ajax` component only. `true` will force the ajax request to execute in `onComponentDidMount` which in turn updates the store. By default, ajax requests are executed in `onComponentDidMount` ONLY if no data exists for the `storeProp`.




## License

MIT © [GLADiator-42](https://github.com/GLADiator-42)
