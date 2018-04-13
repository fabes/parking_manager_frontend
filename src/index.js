import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './main';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
  <MuiThemeProvider>
    <Main />
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
