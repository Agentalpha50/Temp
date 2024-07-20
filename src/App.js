import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/NPTEL/HomePage";
import MainSubject1 from "./components/NPTEL/WildLife";
import MainSubject2 from "./components/NPTEL/ConservationGeo";
import ResultPage from "./components/NPTEL/ResultPage";
import Footer from "./components/NPTEL/Footer";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test/subject1" element={<MainSubject1 />} />
          <Route path="/test/subject2" element={<MainSubject2 />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
