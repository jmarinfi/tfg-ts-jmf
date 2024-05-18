import { useContext } from 'react'
import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import NavBar from '../NavBar'
import { DataContext, base_url_api_r } from '../utils'
import ShowDecomposition from '../ShowDecomposition'
import ShowForecast from '../ShowForecast'


function EtsModel({ sensor = 'default' }) {
  const { data } = useContext(DataContext)

  return (
    <>
      <NavBar />
      {data ? 
      <Container fluid>
        <h2 className='text-center'>Modelo ETS para el sensor {sensor}</h2>
        <Container fluid>
          <Row>
            <Badge bg='secondary' pill className='mt-3'><h3 className='m-1'>Descomposición de la serie:</h3></Badge>
          </Row>
          <ShowDecomposition sensor={sensor} />
          <Row>
            <Badge bg='secondary' pill className='mt-3'><h3 className='m-1'>Predicción:</h3></Badge>
          </Row>
          <ShowForecast baseUrl={base_url_api_r} relUrl={`forecast-ets?sensor=${sensor}`} />
        </Container>
      </Container>
      : 
      <h2 className='text-center'>Los datos no están disponibles. Empieza de nuevo.</h2>}
    </>

  )
}

EtsModel.propTypes = {
  sensor: PropTypes.string.isRequired,
}

export default EtsModel