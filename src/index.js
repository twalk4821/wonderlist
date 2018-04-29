import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const root = (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(root, document.getElementById('root'));
registerServiceWorker();
