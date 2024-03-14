import { Canvas, Navbar, Title, Indicator } from "@components";
import { Providers } from "@contexts";

function App() {
  return (
    <Providers>
      <Navbar />
      <div id="playground">
        <div id="indicators">
          <Title />
          <Indicator />
        </div>
        <Canvas />
      </div>
    </Providers>
  );
}

export default App;
