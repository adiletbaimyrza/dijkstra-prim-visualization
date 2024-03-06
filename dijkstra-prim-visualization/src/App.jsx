import Canvas from "./components/Canvas/Canvas";
import Navbar from "./components/Navbar/Navbar";
import Title from "./components/Title/Title";
import Instructions from "./components/Instructions/Instructions";
import { GraphParamsProvider } from "./contexts/GraphParamsContext";
import { ModalProvider } from "./contexts/ModalsContext";
import { SavedGraphsProvider } from "./contexts/SavedGraphsContext";

function App() {
  return (
    <ModalProvider>
      <GraphParamsProvider>
        <SavedGraphsProvider>
          <Navbar />
          <div id="playground">
            <div id="indicators">
              <Title />
              <Instructions />
            </div>
            <Canvas />
          </div>
        </SavedGraphsProvider>
      </GraphParamsProvider>
    </ModalProvider>
  );
}

export default App;
