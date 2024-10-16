import "./App.css";
import StarWars from "./components/StarWars";

const App = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-between">
      <StarWars />
    </div>
  );
};

export default App;
