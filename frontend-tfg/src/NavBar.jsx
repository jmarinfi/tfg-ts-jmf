import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'

function NavBar() {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container fluid>
                <Navbar.Brand as={Link} to='/'>Inicio</Navbar.Brand>
                <Nav className='me-auto'>
                    <Nav.Link as={Link} to='#'></Nav.Link>
                    <Nav.Link as={Link} to='#'></Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar