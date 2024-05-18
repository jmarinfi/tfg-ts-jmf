import PropTypes from 'prop-types'
import { useContext } from 'react'
import NavBar from '../NavBar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import ShowDiff from '../ShowDiff'
import ShowForecast from '../ShowForecast'
import { DataContext, base_url_api_r } from '../utils'


function NnarModel({sensor}) {
    const { data } = useContext(DataContext)

    return (
      <div>
        <NavBar />
        {data ?
          <Container fluid>
            <h2 className='text-center'>Modelo NNAR para el sensor {sensor}</h2>
            <Container fluid>
              <Row>
                <Badge bg='secondary' pill className='mt-3'><h3 className='m-1'>Diferenciación de la serie:</h3></Badge>
              </Row>
              <ShowDiff sensor={sensor} />
              <Row>
                <Badge bg='secondary' pill className='mt-3'><h3 className='m-1'>Predicción:</h3></Badge>
              </Row>
              <ShowForecast baseUrl={base_url_api_r} relUrl={`forecast-nnar?sensor=${sensor}`} />
            </Container>
          </Container>
          :
          <h2 className='text-center'>Los datos no están disponibles. Empieza de nuevo.</h2>}
      </div>
    )
}

NnarModel.propTypes = {
  sensor: PropTypes.string.isRequired
}

export default NnarModel