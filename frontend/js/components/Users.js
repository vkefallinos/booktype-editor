import React from 'react';
import Relay from 'react-relay';

class Users extends React.Component {
  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.users.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.email} (ID: {edge.node.id})</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(Users, {
  fragments: {
    users: () => Relay.QL`
      fragment on BookTypeUserNodeConnection{
          edges{
            node{
              email
              id
            }
          }

      }
    `,
  },
});
