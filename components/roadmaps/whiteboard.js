"use client";

import { ReactFlowProvider } from "reactflow";
import WhiteboardInner from "./whiteboard_inner";


export default function Whiteboard(props) {
    
  return (
    <ReactFlowProvider>
      <WhiteboardInner {...props} />
    </ReactFlowProvider>
  );
}
