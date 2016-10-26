import React from 'react';
import Relay from 'react-relay';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
};


class Books extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <GridList
          cols={2}
          cellHeight={200}
          padding={1}
          style={styles.gridList}
        >
          {this.props.books.edges.map((edge) => (
            <GridTile
              key={edge.node.id}
              title={edge.node.owner.email}
              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
              actionPosition="left"
              titlePosition="top"
              titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
              cols={edge.node.status ? 2 : 1}
              rows={edge.node.status ? 2 : 1}
            >
              <img src={edge.node.covers.edges[0].node.imageURL} />
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}


export default Relay.createContainer(Books, {
  fragments: {
    books: () => Relay.QL`
      fragment on BookNodeConnection{
          edges{
            node{
              status
              id
              covers(first: 1){
                edges{
                  node{
                    imageURL
                  }
                }
              }
              owner{
                email
              }
            }
          }

      }
    `,
  },
});
