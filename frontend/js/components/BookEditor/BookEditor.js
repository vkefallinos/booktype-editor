import React, { Component } from 'react';
import WikipediaViewer from '../WikipediaViewer/WikipediaViewer'
import BigStockPhotoViewer from '../BigStockPhotoViewer/BigStockPhotoViewer'
import {MegadraftEditor} from 'megadraft';
import {editorStateToJSON, editorStateFromRaw} from 'megadraft';
import ReaderIcon from 'material-ui/svg-icons/action/chrome-reader-mode';;
import CodeIcon from 'material-ui/svg-icons/action/code';;
import ImagesIcon from 'material-ui/svg-icons/image/collections';;
import {highlightCode} from './plugins/highlightCode';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import SvgIcon from 'material-ui/SvgIcon';
import ShareConnection from './plugins/sharedbConnection'

import INITIAL_CONTENT from "./tests/contentExample";

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row wrap',
    padding: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  editorTab: {
    flex: 1,
    width:'70%',
    margin: '5px',
    marginLeft: '50px'
  },
  helperTab: {
    flex: 4,
    width: '20%'
  },
  editorContainer:{
    padding: 60,
    margin: '10px'
  },
  wikiicon:{
    fill:'#222A30'
  }
};
const WikipediaIcon = ()=>(
  <path style={styles.wikiicon} d="M455.724,93.489H367.32h-3v3v9.613v3h3h6.143c7.145,0,13.588,3.667,17.237,9.81
  	c3.648,6.143,3.786,13.555,0.368,19.829l-98.3,180.432l-44.769-106.727l42.169-77.382c8.727-16.014,25.477-25.962,43.714-25.962
  	h1.992h3v-3v-9.613v-3h-3H247.47h-3v3v9.613v3h3h6.143c7.145,0,13.588,3.667,17.237,9.81c3.648,6.143,3.786,13.555,0.368,19.829
  	l-30.587,56.143L213.372,129.9c-1.976-4.71-1.487-9.852,1.341-14.105s7.38-6.693,12.488-6.693h6.988h3v-3v-9.613v-3h-3H128.46h-3v3
  	v9.613v3h3h1.454c20.857,0,39.546,12.428,47.615,31.661l40.277,96.018l-44.887,82.392L93.523,129.9
  	c-1.976-4.71-1.487-9.852,1.341-14.105s7.38-6.693,12.488-6.693h10.737h3v-3v-9.613v-3h-3H3H0v3v9.613v3h3h7.064
  	c20.857,0,39.547,12.428,47.615,31.661l91.526,218.191c1.601,3.816,5.313,6.282,9.458,6.282c3.804,0,7.163-1.998,8.986-5.344
  	l11.939-21.91l45.582-83.646l43.884,104.617c1.601,3.816,5.313,6.282,9.458,6.282c3.804,0,7.163-1.998,8.986-5.344l11.939-21.91
  	l110.58-202.919c8.727-16.014,25.477-25.962,43.714-25.962h1.992h3v-3v-9.613v-3h-2.999V93.489z"/>
)
export default class BookEditor extends Component {
  constructor(props) {
    super(props);
    const content = editorStateFromRaw(INITIAL_CONTENT);
    console.log(content)
    this.keyBindings = [
        { name: "save", isKeyBound: (e) => { return e.keyCode === 83 && e.ctrlKey; }, action: () => { this.onSave(); } }
    ];
    this.state = {
      value: content,
      activeEditorTab: "a",
      activeHelperTab: "a",

    };
    this.onChange = ::this.onChange;
    this.onCodeActive = ::this.onCodeActive;
  }

  componentDidMount() {
    var comp = this;
    highlightCode(this);

    // doc.subscribe(function(err) {
    //   if (err) throw err;
    //   var element = document.querySelector('textarea');
    //   var binding = new StringBinding(element, doc);
    //   binding.setup();
    // });
    // var query = ShareConnection.createSubscribeQuery('players', {$sort: {score: -1}});
    // query.on('ready', update);
    // query.on('changed', update);
    //
    // function update() {
    //   comp.setState({value: query.results});
    // }
  }

  handleEditorTabChange = (tab) => {
    this.setState({
      activeEditorTab: tab
    });
  };

  handleHelperChange = (tab) => {
    this.setState({
      activeHelperTab: tab
    });
  };

  onChange(value) {
    console.log(value)

    // var a = this.state.value.blocks
    // var b = value.blocks
    // var onlyInA = a.filter(function(current){
    //     return b.filter(function(current_b){
    //         return current_b.value == current.value && current_b.display == current.display
    //     }).length == 0
    // });
    //
    // var onlyInB = b.filter(function(current){
    //     return a.filter(function(current_a){
    //         return current_a.value == current.value && current_a.display == current.display
    //     }).length == 0
    // });

    this.setState({
      value
    });
  }

  onSave() {
    console.log("save");
  }

  onCodeActive() {
    highlightCode(this);
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.editorTab}>
        <Tabs   value={this.state.activeEditorTab} onChange={this.handleEditorTabChange}>
         <Tab label="Editor" value="a" icon={<ReaderIcon />}>
         <Paper zDepth={2}>
           <div style={styles.editorContainer}>
               <MegadraftEditor

                 editorState={this.state.value}
                 placeholder="Text"
                 onChange={this.onChange}
                 keyBindings={this.keyBindings}/>
             </div>
           </Paper>
         </Tab>
         <Tab label="Content JSON" onActive={this.onCodeActive} value="b" icon={<CodeIcon />}>
           <div className="tab-container-json">
             <pre className="jsonpreview">
               <code className="json hljs">
                 {editorStateToJSON(this.state.value)}
               </code>
             </pre>
           </div>
         </Tab>
       </Tabs>
       </div>
       <div style={styles.helperTab}>
        <Tabs  value={this.state.activeHelperTab} onChange={this.handleHelperChange}>
          <Tab label="Images" value="a" icon={<ImagesIcon />}>
            <Paper zDepth={2}>
            <div >
              <BigStockPhotoViewer />
            </div>
            </Paper>
          </Tab>
          <Tab label="Wikipedia" onActive={this.onCodeActive} value="b" icon={<SvgIcon> <WikipediaIcon/></SvgIcon>}>
            <WikipediaViewer />
          </Tab>
        </Tabs>
        </div>
      </div>
    );
  }
}
