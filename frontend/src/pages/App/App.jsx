import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getUser } from "../../services/authService";
import HomePage from "../HomePage/HomePage";
import GroupsPage from "../GroupsPage/GroupsPage";
import CreateGroupPage from "../CreateGroupPage/CreateGroupPage";
import SignUpPage from "../SignUpPage/SignUpPage";
import LoginPage from "../LoginPage/LoginPage";
import NavBar from "../../components/NavBar/NavBar";
import GroupDetailsPage from "../GroupDetailsPage/GroupDetailsPage";
import CreateOutingPage from "../CreateOutingPage/CreateOutingPage";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/new" element={<CreateGroupPage />} />
            <Route path="*" element={null} />
            <Route path="/groups/:id" element={<GroupDetailsPage />} />
            <Route path="/groups/:id/outings/new" element={<CreateOutingPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="*" element={null} />
          </Routes>
        )}
      </section>
    </main>
  );
}
