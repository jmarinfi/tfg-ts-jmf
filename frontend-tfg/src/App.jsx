import 'bootstrap/dist/css/bootstrap.min.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'
import NavBar from './NavBar'


function App() {

  return (
    <div>
      <NavBar />
      <h1 className='text-center mt-3'>Análisis de series temporales</h1>
      <Row className='mt-3 ms-3 me-3'>
        <Col>
          <h2>Instrumentación estructural</h2>
          <p>Elige un sensor para analizar:</p>
          <ListGroup>
            <ListGroup.Item>
              <Link to={'/86316A'} className='btn btn-link'>Clinómetro 86316 dirección A</Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={'/86317B'} className='btn btn-link'>Clinómetro 86317 dirección B</Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={'/25466X'} className='btn btn-link'>Prisma topográfico 25466 dirección X</Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={'/25481Y'} className='btn btn-link'>Prisma topográfico 25555 dirección Y</Link>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <h2>Instrumentación geotécnica</h2>
          <p>Elige un sensor para analizar:</p>
          <ListGroup>
            <ListGroup.Item>
              <Link to={'/HN53842'} className='btn btn-link'>Hito de nivelación de túnel 53842</Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={'/HNP86142'} className='btn btn-link'>Hito de nivelación profundo 86142</Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={'/HN43576'} className='btn btn-link'>Hito de nivelación de estación 43567</Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={'/PZ68476'} className='btn btn-link'>Piezómetro 68476</Link>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  )
}

export default App
