import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AddressBar from './components/AddressBar';
import { NavigationButtons } from './components/NavigationButtons';
import './App.css';

function NavigationBar() {
  return (
    <div className="app">
      <NavigationButtons />
      <AddressBar />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavigationBar />} />
      </Routes>
    </Router>
  );
}
