import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import Layout from "./components/layout/Layout";
import LandingPage from "./components/LandingPage";
import MultiModeSummarizer from "./pages/MultiModeSummarizer";
import DocumentAnalyzer from "./pages/DocumentAnalyzer";
import NotesGenerator from "./pages/NotesGenerator";
import CompareSummaries from "./pages/CompareSummaries";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/summarize" element={<MultiModeSummarizer />} />
              <Route path="/analyze" element={<DocumentAnalyzer />} />
              <Route path="/notes" element={<NotesGenerator />} />
              <Route path="/compare" element={<CompareSummaries />} />
            </Routes>
          </Layout>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
