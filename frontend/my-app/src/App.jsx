import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from "./signup";
import Login from "./login";
import Dashboard from "./Dashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
