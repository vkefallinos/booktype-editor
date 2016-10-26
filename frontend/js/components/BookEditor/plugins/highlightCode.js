
import ReactDOM from "react-dom";
import { highlightBlock } from 'highlight.js'

export function highlightCode (element) {
  const domNode = ReactDOM.findDOMNode(element);
  const nodes = domNode.querySelectorAll("pre code");
  if (nodes.length > 0) {
    for (let i = 0; i < nodes.length; i=i+1) {
      /* global hljs */
      highlightBlock(nodes[i]);
    }
  }
}
