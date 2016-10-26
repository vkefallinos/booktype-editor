
import sharedb from 'sharedb/lib/client'
// Expose a singleton WebSocket connection to ShareDB server
var socket = new WebSocket('ws://' + window.location.hostname+":8082");
var ShareConnection = new sharedb.Connection(socket);
export default ShareConnection;
