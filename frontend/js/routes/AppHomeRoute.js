import Relay from 'react-relay';

export default class extends Relay.Route {
  static routeName = 'AppHomeRoute';
  static queries = {
    books: (Component) => Relay.QL`
    query BooksQuery{
      allBooks{
            ${Component.getFragment('books')}
      }
    }
    `,
    users: (Component) => Relay.QL`
    query UsersQuery{
      allBooktypeusers{
        ${Component.getFragment('users')}
      }
    }
    `

  };
}
