import React from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <>
      <Navbar bg="dark" className="mb-4" style={{ height: "3.7rem" }}>
        <Container>
          <h2>
            <Link to="/" className="link-light text-decoration-none">
              Chat App
            </Link>
          </h2>
          <span className="text-warning">Logged in as utsav</span>
          <Nav>
            <Stack direction="horizontal" gap={3}>
              <Link to="/login" className="link-light text-decoration-none">
                login
              </Link>
              <Link to="/register" className="link-light text-decoration-none">
                Register
              </Link>
            </Stack>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
