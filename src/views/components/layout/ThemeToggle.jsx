import React from 'react';
import { Form } from 'react-bootstrap';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <Form.Check
      type="switch"
      id="theme-switch"
      label={
        <span>
          <i className={`bi ${theme === 'light' ? 'bi-sun' : 'bi-moon'}`}></i>
          {theme === 'light' ? ' Light' : ' Dark'}
        </span>
      }
      checked={theme === 'dark'}
      onChange={toggleTheme}
    />
  );
};

export default ThemeToggle;