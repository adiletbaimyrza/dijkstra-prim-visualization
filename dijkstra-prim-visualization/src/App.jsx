import "./App.css";
import Canvas from "./components/Canvas/Canvas";
import { GraphParamsProvider } from "./GraphParamsContext";

function App() {
  return (
    <GraphParamsProvider>
      <Canvas />
    </GraphParamsProvider>
  );
}

export default App;
