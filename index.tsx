import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Could not find root element to mount to. The 'root' div is missing from your index.html.");
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// To prevent race conditions where the script runs before the DOM is fully loaded,
// we'll wait for the DOMContentLoaded event before rendering the app.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // DOMContentLoaded has already fired
  renderApp();
}
