import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Main App component
import MobileApp from "./App-v1";
import "./index.css"


import AppProviders from './context/AppProviders'

// Wrap your App component with BrowserRouter
const root = ReactDOM.createRoot(document.getElementById("root"));
//Calculate view port size. We will use this to render mobile vs desktop app
const width = window.innerWidth;
const height = window.innerHeight;

//</React.StrictMode> causes react re rerender twice in debug mode. Used to help find bugs in re-renders
if(width < 750) {
  root.render(
    <BrowserRouter>
      <AppProviders>
        <MobileApp />
      </AppProviders>
    </BrowserRouter>
  );
}
else {
  root.render(
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  );
}
