import AppRouter from "./routes";
import './App.css';
import Header from "./components/header";

function App() {
  return (
    <>
    <Header></Header>
      <div className="pages-container"  id="pages-container">
        <AppRouter></AppRouter>
      </div>
    </>
  );
}

export default App;
