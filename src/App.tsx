import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Testing from './pages/testing';
import { ThemeProvider } from './components/theme-provider';
function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/testing" element={<Testing />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
