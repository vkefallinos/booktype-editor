import chokidar from 'chokidar';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {clean} from 'require-clean';
import {exec} from 'child_process';
import mongoose from 'mongoose';
import {Schema} from './backend/schema'

import http from 'http';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebSocketJSONStream from 'websocket-json-stream';


import {createApp} from './backend/Models/App/AppSchema'
import {createModel} from './backend/Models/Model/ModelSchema'
import {createCustomAction} from './backend/Models/Action/ActionSchema'
import {createQuery} from './backend/Models/Query/QuerySchema'
import {createSimpleProperty, createRefProperty} from './backend/Models/Property/PropertySchema'

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;


createApp({name:"BookType",description: "A book app"}).then((app,err)=>{
  console.log(app)
  createModel({name:"Book",description: "The Book model", app:app.id}).then((model,err)=>{
    console.log(model)
    createCustomAction({
      name: "SayHiToModel",
      description: "Say hi to a Model.",
      args: [{name:"name",type:"String"}, {name:"description", type:"String"}],
      model: model.id,
      code: `return 'this is my name '+ name + ' and my description '+ description`
    })
    createSimpleProperty({
      name: "title",
      description: "The title of the book.",
      type: "String",
      model: model.id
    })
    createRefProperty({
      name: "similarTo",
      description: "A similar book.",
      type: model.id,
      model: model.id
    })
    createQuery({
      name: "Titles on letter A",
      description: "All book titles that start with letter A",
      model: model.id,
      filter: [{field: 'title', operator:'startswith', value: "A"}],
      sort: [{field:'title', reverse: true}]
    })
  })
})

let graphQLServer;
let appServer;

function startAppServer(callback) {
  // Serve the Relay app
  const compiler = webpack({
    entry: path.resolve(__dirname, 'frontend/js', 'app.js'),
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: 'babel',
          test: /\.js$/,
        }
      ]
    },
    output: {filename: '/app.js', path: '/', publicPath: '/js/'}
  });
  appServer = new WebpackDevServer(compiler, {
    contentBase: '/public/',
    proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
    publicPath: '/js/',
    stats: {colors: true}
  });
  // Serve static resources
  appServer.use('/', express.static(path.resolve(__dirname, 'public')));
  appServer.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
    if (callback) {
      callback();
    }
  });
}

function startGraphQLServer(callback) {
  // Expose a GraphQL endpoint
  // clean('./data/schema');
  // const Schema = require('./data/schema');
  const graphQLApp = express();
  graphQLApp.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema: Schema,
  }));
  graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {
    console.log(
      `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
    );
    mongoose.connect('mongodb://localhost/AppLang');
    if (callback) {
      callback();
    }
  });
}

function startServers(callback) {
  // Shut down the servers
  if (appServer) {
    appServer.listeningApp.close();
  }
  if (graphQLServer) {
    graphQLServer.close();
  }

  // Compile the schema
  exec('npm run update-schema', (error, stdout) => {
    console.log(stdout);
    let doneTasks = 0;
    function handleTaskDone() {
      doneTasks++;
      if (doneTasks === 2 && callback) {
        callback();
      }

    }
    startGraphQLServer(handleTaskDone);
    startAppServer(handleTaskDone);
  });
}


var backend = new ShareDB();
createDoc(startShareServer);

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'textarea');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create('', callback);
      return;
    }
    callback();
  });
}

function startShareServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static('static'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws, req) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8082);
  console.log('Listening on http://localhost:8082');
}
const watcher = chokidar.watch('./backend/{schema}.js');
watcher.on('change', path => {
  console.log(`\`${path}\` changed. Restarting.`);
  startServers(() =>
    console.log('Restart your browser to use the updated schema.')
  );
});
startServers();
