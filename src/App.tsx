import React from 'react';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './Routes/routes';

function App() {
  const router = createBrowserRouter(routes);

  return (
    <div className='min-h-screen bg-gray-100' data-testId='app-entry-container'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
