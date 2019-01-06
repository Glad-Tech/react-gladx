import React, {Component} from 'react';
import {Ajax, AjaxButton, STORE_ACTIONS, REQUEST_METHODS} from 'react-gladx'
import {USERS} from './StoreProps'
import {Header, Item, Button, Icon, Form, Input} from 'semantic-ui-react'
import PropTypes from "prop-types";


export default class UserManager extends Component {

    state = {addingUser: false,};

    render() {
        const {addingUser} = this.state;
        return (
            <div>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='users' circular/>
                    <Header.Content>User Manager</Header.Content>
                </Header>

                <Ajax storeProp={USERS} requestMethod={REQUEST_METHODS.GET}
                      content={result => <Users keys={result.keys} data={result.data}/> }/>

                {addingUser ? <NewUser hide={() => this.setState({addingUser: false})}/>
                    : <Button fluid primary onClick={() => this.setState({addingUser: true})} content={'Add User'}/> }

            </div>
        )
    }
}

class Users extends Component {

    render() {
        const {keys, data} = this.props
        return (
            <Item.Group divided>

                {keys.map((userId, index) => <User key={index} user={data[userId]}/>)}

            </Item.Group>
        )
    }
}
Users.propTypes = {
    keys: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,

};

class User extends Component {

    render() {
        const {id, name, company, title, link} = this.props.user
        return (

            <Item>
                <Item.Image src={link}/>

                <Item.Content>
                    <Item.Header as='a'>{company}</Item.Header>
                    <Item.Meta>
                        <span className='cinema'>{title}</span>
                    </Item.Meta>
                    <Item.Description>{name}</Item.Description>
                    <Item.Extra>
                        <AjaxButton storeProp={USERS}
                                    endpoint={'user/delete/' + id}
                                    action={STORE_ACTIONS.DELETE}
                                    requestData={{id: id}}
                                    loader={<Button color="red" content={'Delete'} loading={true} floated='right'/>}
                                    content={executeRequest => <Button color="red" onClick={executeRequest}
                                                                       content={'Delete'} floated='right'/>}
                        />

                    </Item.Extra>
                </Item.Content>
            </Item>
        )
    }
}
User.propTypes = {
    user: PropTypes.object.isRequired,

};

class NewUser extends Component {
    handleInputChange = (e, {name, value}) => this.setState({[name]: value})

    addUserButton = (loading, click) => <Button color="green" loading={loading} onClick={click} content={'Add'}
                                                floated='right'/>

    state = {link: 'https://react.semantic-ui.com/images/wireframe/image.png'}

    render() {
        const {hide} = this.props

        return (
            <Form>
                <Form.Field
                    control={Input}
                    label='Name'
                    name="name"
                    onChange={this.handleInputChange}
                />
                <Form.Field
                    control={Input}
                    label='Company'
                    name="company"
                    onChange={this.handleInputChange}
                />
                <Form.Field
                    control={Input}
                    label='Title'
                    name="title"
                    onChange={this.handleInputChange}
                />
                <AjaxButton storeProp={USERS}
                            endpoint={'user/add'}
                            action={STORE_ACTIONS.ADD}
                            onRequestSuccess={hide}
                            requestData={this.state}
                            loader={this.addUserButton(true)}
                            content={executeRequest => this.addUserButton(false, executeRequest)}
                />
                <Button content={'Cancel'} onClick={hide}/>
            </Form>
        )
    }
}
NewUser.propTypes = {
    hide: PropTypes.func.isRequired,

};
