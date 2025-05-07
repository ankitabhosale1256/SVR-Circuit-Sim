import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode }) => {
  return (
    <Editor
      height="400px"
      defaultLanguage="cpp"
      value={code}
      onChange={(val) => setCode(val)}
      theme="vs-dark"
    />
  );
};

export default CodeEditor;
