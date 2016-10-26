import Relay from 'react-relay';

export default {
  books: Component => Relay.QL`
    query {
      allBooks{
        ${Component.getFragment('books')}
      }
    }
  `
};
