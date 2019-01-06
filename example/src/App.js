import React, {Component} from 'react';
import UserManager from './UserManager'
import {Container} from 'semantic-ui-react'


class App extends Component {
  render() {
    return <Container text>

      <UserManager />
    </Container>
  }
}

export default App;
