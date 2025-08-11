import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Quiz from "./pages/Quiz";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MyDocuments from "./pages/MyDocuments";
import Stories from "./pages/Stories";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import ProtectedRoute from "./components/ProtectedRoute";
import ConsentModal from "./ConsentModal";

export default function App() {
  return (
    <Router>
      <Layout>
        <ConsentModal />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Protected */}
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-documents" element={<ProtectedRoute><MyDocuments /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}
