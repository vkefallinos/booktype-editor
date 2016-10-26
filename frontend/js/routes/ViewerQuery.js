import Relay from 'react-relay';

export default {
  books: Component => Relay.QL`
    query {
      allBooks{
        ${Component.getFragment('books')}
      }
    }
  `,
  users: (Component) => Relay.QL`
    query {
      allBooktypeusers{
        ${Component.getFragment('users')}
      }
    }
  `

};
