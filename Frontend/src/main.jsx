import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';  // optional if you have styles
import { UserProvider } from './context/usercontext.jsx';
import { Pinprovider } from './context/pincontext.jsx';
import axios from 'axios';
import { BoardProvider } from './context/boardcontext.jsx';
import { UploadProvider } from './context/uploadcontext.jsx';


axios.defaults.withCredentials = true; 

ReactDOM.createRoot(document.getElementById('root')).render(

    <UploadProvider>
       <BoardProvider>
      <UserProvider>
      <Pinprovider>
      <App />
      </Pinprovider>
    </UserProvider>
    </BoardProvider>
    </UploadProvider>
   
    
   
  
);
