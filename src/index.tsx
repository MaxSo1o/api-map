import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from "./modules/Main";

const main = ReactDOM.createRoot(
  document.getElementById('main') as HTMLElement
);
main.render(
    <Main/>
);