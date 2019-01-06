# react-gladx

Don't you dare say it! Don't you dare say this is NOT what the Context API was intended for, mmKay.
-----

If you're like me, then you are fed up with the boilerplate code Redux needed to do even the most simple of tasks. This module
 intends to help solve problem. 
if we could let our components update the store with 
 Can we please    

> Default loading and error components

> Built in array normalization 

> Access and update the store from any component 

> Ajax components to  

> Single Store  


First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

[![NPM](https://img.shields.io/npm/v/react-gladx.svg)](https://www.npmjs.com/package/react-gladx) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

render(){
  return <Ajax storeProp={'users'} requestMethod={REQUEST_METHODS.GET}
                      content={result => <Users keys={result.keys} data={result.data}/> }/>
}
```

Utilize the `AjaxButton` component to execute actions that update store data. 

```jsx
import {AjaxButton, REQUEST_METHODS, STORE_ACTIONS} from 'react-gladx'

render(){
                  return <AjaxButton storeProp={'users'}
                                     endpoint={'user/add'}
                                     action={STORE_ACTIONS.ADD}
                                     onRequestSuccess={()=>this.setState({hide})}
                                     requestData={{name:'Bob'}}
                                     loader={<Button loading={true}/>}
                                     content={executeRequest =><Button loading={false} onClick={executeRequest} />}
                         />
}
```


Access the store/context using the `GladXContext` consumer. 

```jsx
import {GladXContext} from 'react-gladx'

render(){
                 return (
                 <GladXContext.Consumer>
                         {({actions, store, requestMethods, defaultComponents}) => <Component/>}
                         </GladXContext.Consumer>
                 )
}
```


## License

MIT © [GLADiator-42](https://github.com/GLADiator-42)
