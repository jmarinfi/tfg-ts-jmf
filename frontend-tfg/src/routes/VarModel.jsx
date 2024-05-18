import PropTypes from 'prop-types'
import { useContext } from 'react'
import { DataContext, base_url_api_r } from '../utils'
import NavBar from '../NavBar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import ShowSeries from '../ShowSeries'
import ShowForecast from '../ShowForecast'


function VarModel({ sensor, sensor2 }) {
  const { data } = useContext(DataContext)

  return (
    <div>
      <NavBar />
      {data ?
        <Container fluid>
          <h2 className='text-center'>Modelo VAR para el sensor {sensor}</h2>
          <Container fluid>
            <Row>
              <Badge bg='secondary' pill className='mt-3'><h3 className='m-1'>Visualización de ambas series:</h3></Badge>
            </Row>
            <ShowSeries sensor1={sensor} sensor2={sensor2} />
            <Row>
              <Badge bg='secondary' pill className='mt-3'><h3 className='m-1'>Predicción:</h3></Badge>
            </Row>
            <ShowForecast baseUrl={base_url_api_r} relUrl={`forecast-var?sensor1=${sensor}&sensor2=${sensor2}`} />
          </Container>
        </Container>
        :
        <h2 className='text-center'>Los datos no están disponibles. Empieza de nuevo.</h2>}
    </div>
  )
}

VarModel.propTypes = {
  sensor: PropTypes.string.isRequired,
  sensor2: PropTypes.string.isRequired
}

export default VarModel