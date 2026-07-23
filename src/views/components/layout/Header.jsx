import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const Header = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();   // get user and logout from context

  return (
    <Navbar bg="success" variant="dark" expand="lg" className="main-header">
      <Container fluid>
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <i className="bi bi-music-note-beamed me-2"></i>
          <strong>LinTune Manager</strong>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#dashboard" className="text-light">
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link href="#docs" className="text-light">
              <i className="bi bi-file-text me-1"></i>
              Documentation
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center">
            {/* Show user name if authenticated */}
            {user && (
              <span className="text-light me-2">
                <i className="bi bi-person-circle me-1"></i>
                {user.displayName || user.userName}
              </span>
            )}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {user && (
              <Button
                variant="outline-light"
                size="sm"
                className="ms-2"
                onClick={logout}  
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;