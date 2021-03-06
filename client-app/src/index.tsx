//              ___            ________      ___________              ___ 
//             /  $$          / $$ $$$ $$    |  $$ $$ $$            /  $$
//            /  $$$$       /  $$    \  $$   |  $$   \  $$         /  $$$$
//           /  $$  $$     |  $$      \  $$  |  $$    | $$        /  $$  $$
//          /  $$    $$    |  $$       | $$  |  $$   /  $$       /  $$    $$
//         /  $$ $$$$ $$   |  $$       | $$  |  $$ $$ $$        /  $$ $$$$ $$
//        /  $$_______ $$  |  $$       | $$  |  $$  \  $$      /  $$_______ $$ 
//       /  $$       \  $$  \  $$     / $$   |  $$   \  $$    /  $$       \  $$
//      /__$$         \__$$  \__$$ $$$ $$    |__$$    \__$$  /__$$         \__$$
//
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import {createBrowserHistory} from 'history'
import 'semantic-ui-css/semantic.min.css'
import 'react-calendar/dist/Calendar.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import './app/layout/style.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/api/stores/Store';
import ScrollToTop from './app/layout/ScrollToTop';

// This history object can be used throughout the application
// so long as you import it from here and also pass it
// into the Router componenet. It is very useful!
export const history = createBrowserHistory()

ReactDOM.render(
    <StoreContext.Provider value={store}>
        <Router history={history}>            
            <ScrollToTop />
            <App />
        </Router>        
    </StoreContext.Provider>, 
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
