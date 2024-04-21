import { useState } from 'react';
import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import LoginModal from './LoginModal';
import AccountSettingsModal from './AccountSettingsModal';

function App() {
    /* State */
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showAccountSettingsModal, setShowAccountSettingsModal] = useState(false);

    /* Handlers */
    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleShowLoginModal = () => setShowLoginModal(true);

    const handleLogin = (email) => {
        setIsLoggedIn(true);
        setUserEmail(email);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserEmail('');
    };

    const handleShowAccountSettingsModal = () => {
        setShowAccountSettingsModal(true);
    };

    const handleCloseAccountSettingsModal = () => {
        setShowAccountSettingsModal(false);
    };
    // This will be deleted...
    const handleAdd = () => {
      alert('Add purchase pass modal to this button');
    }

    /* Components */
    function AppHeader() {
        return (
            <div className="App-header">
              <h1>Visitor Parking</h1>              
                <h5>{isLoggedIn ? `Welcome back, ${userEmail}` : 'Please sign in.'}</h5>
            </div>
        );
    }

    function AppMain() {
        return (
            <div className="App-main">

                {!isLoggedIn && (
                  <>
                    <Button variant='primary' onClick={handleShowLoginModal}>
                        Login
                    </Button>
                    <br/>
                    <h5>or</h5>
                    <Button onClick={handleAdd}>
                      Purchase Guest Pass {/* Add purchase pass modal to this button */}
                    </Button>
                  </>
                )}
                {isLoggedIn && (
                    <Button variant='primary' onClick={handleShowAccountSettingsModal}>
                        Account Settings
                    </Button>
                )}
                <br/> <br/>
                {isLoggedIn && (
                    <Button variant="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                )}

                <LoginModal
                    show={showLoginModal}
                    handleClose={handleCloseLoginModal}
                    handleLogin={handleLogin}
                />

                <AccountSettingsModal 
                    show={showAccountSettingsModal}
                    handleClose={handleCloseAccountSettingsModal}
                />
            </div>
        );
    }

    /* Render */
    return (
        <>
            <AppHeader />
            <AppMain />
        </>
    );
}

export default App;