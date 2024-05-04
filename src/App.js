import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import NewUser from './components/NewUser';
import UserDetails from './components/UserDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<NewUser />} />
        <Route path="/userDetails" element={<UserDetails />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
