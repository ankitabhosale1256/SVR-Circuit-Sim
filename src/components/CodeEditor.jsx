
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode }) => (
  <Editor
    height="400px"
    defaultLanguage="cpp"
    value={code}
    onChange={(val) => setCode(val)}
  />
);
export default CodeEditor;
