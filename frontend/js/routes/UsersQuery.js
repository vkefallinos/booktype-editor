import Relay from 'react-relay';

export default {
  users: Component => Relay.QL`
    query {
      allBooktypeusers{
        ${Component.getFragment('users')}
      }
    }
  `

};
