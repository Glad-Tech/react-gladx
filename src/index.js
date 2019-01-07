import React,{Component} from "react";
import PropTypes from "prop-types";
import update from 'immutability-helper';
import {normalize, schema} from 'normalizr';

export const STORE_ACTIONS = {
  DELETE: 'DELETE',
  ADD: 'ADD',
  UPDATE: 'UPDATE'
}
export const REQUEST_METHODS = {
  POST: 'POST',
  GET: 'GET',
}

export const GladXContext = React.createContext();

export class GladX extends Component {

  constructor(props) {
    super(props);
    this.state = {
      store: {
        ...props.initialState,
      },
      actions: {
        setStoreState: props.enableUnsafeStoreUpdate === true ? (state) => this.setState(state) : () => {
        },
        [STORE_ACTIONS.UPDATE]: (storeProp, data) => {
          if (isNormalized(this.state.store[storeProp])) {
            this.setState(update(this.state, {store: {[storeProp]: {data: {[data.id]: {$set: data}}}}}))


          } else {

            this.setState(update(this.state, {store: {[storeProp]: {$set: data}}}))

          }
        },
        [STORE_ACTIONS.DELETE]: (storeProp, data) => {
          if (isNormalized(this.state.store[storeProp])) {

            const index = this.state.store[storeProp].keys.findIndex(key => key === data.id)
            if (index > -1) {
              this.setState(update(this.state, {store: {[storeProp]: {keys: {$splice: [[index, 1]]}}}}))
              this.setState(update(this.state, {store: {[storeProp]: {data: {$unset: [[data.id]]}}}}))
            }

          } else {
            this.setState(update(this.state, {store: {[storeProp]: {$set: null}}}))

          }
        },
        [STORE_ACTIONS.ADD]: (storeProp, data) => {
          if (isNormalized(this.state.store[storeProp])) {
            this.setState(update(this.state, {store: {[storeProp]: {data: {[data.id]: {$set: data}}}}}))
            this.setState(update(this.state, {store: {[storeProp]: {keys: {$push: [data.id]}}}}))


          } else {
            this.setState(update(this.state, {store: {[storeProp]: {$set: data}}}))

          }
        },
      },
      requestMethods: {
        [REQUEST_METHODS.POST]: props.post,
        [REQUEST_METHODS.GET]: props.get,
      },
      defaultComponents: {
        loader: props.loader,
        failure: props.failure
      }
    }
  }

  render() {

    return (
      <GladXContext.Provider value={this.state}>
        { this.props.children }
      </GladXContext.Provider>
    )
  }
}

GladX.propTypes = {
  initialState: PropTypes.object.isRequired,
  failure: PropTypes.any.isRequired,
  loader: PropTypes.any.isRequired,
  get: PropTypes.func.isRequired,
  post: PropTypes.func.isRequired,
};


export class AjaxButton extends Component {

  render() {
    const {storeProp, action, endpoint, requestMethod, loader, failure} = this.props;
    return (
      <GladXContext.Consumer>
        {({actions, store, requestMethods, defaultComponents}) => <StateManager {...this.props}
                                                                                requestMethod={requestMethods[requestMethod]}
                                                                                defaultLoading={false}
                                                                                executeRequestOnMount={false}
                                                                                endpoint={endpoint ? endpoint : storeProp}
                                                                                updateStore={actions[action]}
                                                                                data={null}
                                                                                failure={failure ? failure : defaultComponents.failure}
                                                                                loader={loader ? loader : defaultComponents.loader}
        />
        }
      </GladXContext.Consumer>
    )
  }
}

AjaxButton.propTypes = {
  endpoint: PropTypes.string,
  failure: PropTypes.any,
  loader: PropTypes.any,
  requestData: PropTypes.any,
  requestMethod: PropTypes.string,
  action: PropTypes.string,
  storeProp: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired,
  maxDuration: PropTypes.number,
  onRequestError: PropTypes.func,
  onRequestSuccess: PropTypes.func,
  allowRetry: PropTypes.bool,

};

AjaxButton.defaultProps = {
  action: STORE_ACTIONS.UPDATE,
  requestMethod: REQUEST_METHODS.POST
};

export class Ajax extends Component {

  render() {
    const {storeProp, action, endpoint, requestMethod, executeRequestOnMount, loader, failure} = this.props;
    return (
      <GladXContext.Consumer>
        {({actions, store, requestMethods, defaultComponents}) => <StateManager {...this.props}
                                                                                requestMethod={requestMethods[requestMethod]}
                                                                                endpoint={endpoint ? endpoint : storeProp}
                                                                                updateStore={actions[action]}
                                                                                data={store[storeProp]}
                                                                                executeRequestOnMount={executeRequestOnMount === true || store[storeProp] === null}
                                                                                failure={failure ? failure : defaultComponents.failure}
                                                                                loader={loader ? loader : defaultComponents.loader}
        />
        }
      </GladXContext.Consumer>
    )
  }
}

Ajax.propTypes = {
  endpoint: PropTypes.string,
  requestData: PropTypes.any,
  requestMethod: PropTypes.string,
  action: PropTypes.string,
  failure: PropTypes.any,
  loader: PropTypes.any,
  storeProp: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired,
  maxDuration: PropTypes.number,
  onRequestError: PropTypes.func,
  onRequestSuccess: PropTypes.func,
  allowRetry: PropTypes.bool,
  executeRequestOnMount: PropTypes.bool,

};

Ajax.defaultProps = {
  action: STORE_ACTIONS.UPDATE,
  requestMethod: REQUEST_METHODS.POST
};

class StateManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: props.maxDuration <= 0 && props.defaultLoading && props.executeRequestOnMount,
      error: null,
      retryAttempts: -1,
    };

  }

  normalizeResponse = response => {
    const {storeProp} = this.props;

    const propSchema = new schema.Entity(storeProp);
    return normalize(response, new schema.Array(propSchema));
  }


  handleResponse = response => {
    const {storeProp, updateStore} = this.props;

    if (Array.isArray(response)) {

      const normalized = this.normalizeResponse(response);
      updateStore(storeProp, {
        keys: normalized.result,
        data: normalized.entities[storeProp]
      });

    } else {
      updateStore(storeProp, response);
    }

  }

  executeAjaxRequest = () => {
    const {endpoint, requestMethod, requestData, onRequestSuccess, onRequestError} = this.props;

    this.setState({loading: true});

    requestMethod(endpoint, requestData).then(response => {


        this.updateStoreSuccessPromise = makeCancelable(
          new Promise(r => this.setState({loading: false, error: null, retryAttempts: 0}))
        );
        this.handleResponse(response);

        this.updateStoreSuccessPromise.promise
          .then(() => {
          })
          .catch(() => {
          });

        if (typeof onRequestSuccess === 'function') {
          onRequestSuccess(response);

        }

      }
    ).catch(error => {

      this.setState({loading: false, error: error, retryAttempts: this.state.retryAttempts + 1});

      if (typeof onRequestError === 'function') {
        onRequestError(error)
      }
    })
  }


  maxDurationRender = () => {
    const {executeRequestOnMount, maxDuration, defaultLoading, data} = this.props;

    if (executeRequestOnMount && maxDuration > 0 && !defaultLoading) {

      setTimeout(() => {
          if (data === null) {
            this.setState({loading: true})
          }
        }, maxDuration
      )
      return true;
    }
  }

  componentDidMount() {
    const {executeRequestOnMount} = this.props;

    this.maxDurationRender();

    if (executeRequestOnMount) {
      this.executeAjaxRequest();
    }
    this.updateStoreSuccessPromise = null
  }

  componentWillUnmount() {
    if (this.updateStoreSuccessPromise) {
      this.updateStoreSuccessPromise.cancel()
    }
  }

  render() {
    const {loading, error, retryAttempts} = this.state;
    const {loader, data, failure, content, executeRequestOnMount, allowRetry, retryAttemptLimit} = this.props;

    if (error) {
      return allowRetry && retryAttemptLimit < retryAttempts ? failure(error, this.executeAjaxRequest) : failure(error)
    }

    if (loading) {
      return loader
    }
    if (data) {
      return content(data)
    }

    if (!executeRequestOnMount) {
      return content(this.executeAjaxRequest)
    }

    return null;
  }
}


StateManager.propTypes = {
  endpoint: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired,
  requestData: PropTypes.any,
  requestMethod: PropTypes.func.isRequired,
  storeProp: PropTypes.string.isRequired,
  data: PropTypes.any,
  maxDuration: PropTypes.number.isRequired,
  failure: PropTypes.any.isRequired,
  loader: PropTypes.any.isRequired,
  allowRetry: PropTypes.bool.isRequired,
  retryAttemptLimit: PropTypes.number,
  updateStore: PropTypes.func.isRequired,
  onRequestError: PropTypes.func,
  onRequestSuccess: PropTypes.func,
  defaultLoading: PropTypes.bool.isRequired,
  executeRequestOnMount: PropTypes.bool.isRequired,
};

StateManager.defaultProps = {
  defaultLoading: true,
  executeRequestOnMount: true,
  allowRetry: false,
  maxDuration: 0,
  retryAttemptLimit: 2,
};

const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

function isNormalized(array) {
  return array && Array.isArray(array.keys)
}
