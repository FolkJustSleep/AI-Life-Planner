import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AddHabitPage from './components/features/habits/AddHabitPage';

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/add-habit" element={<AddHabitPage />} />
      </Routes>
    </BrowserRouter>
  );
}
