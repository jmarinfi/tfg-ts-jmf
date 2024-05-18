import { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import NavBar from '../NavBar'
import ShowData from '../ShowData'
import { DataContext, base_url_api_r } from '../utils'


function IniPage({ sensor, filePath, structural = true }) {
  const { data, setData } = useContext(DataContext)

  useEffect(() => {
    fetch(base_url_api_r + 'import?filename=' + filePath)
      .then(response => response.json())
      .then(data => setData(data))
  }, [filePath, setData])

  return (
    <>
      <NavBar />
      <Container fluid>
        <h2 className='text-center'>Sensor: {sensor}</h2>
        {data && (
          <Container fluid className='mt-3'>
            <Row>
              <Badge bg='secondary' pill><h3 className='m-1'>Exploración preliminar:</h3></Badge>
            </Row>
            <ShowData data={data} />
            <Row>
              <Badge bg='secondary' pill><h3 className='m-1'>Selecciona un modelo:</h3></Badge>
            </Row>
            <Row className='mt-3 mb-3'>
              <ButtonGroup aria-label='Modelos disponibles'>
                <Button as={Link} to={'/' + sensor + '/ets'} variant='info'>ETS</Button>
                <Button as={Link} to={'/' + sensor + '/arima'} variant='info'>ARIMA</Button>
                {structural && <Button as={Link} to={'/' + sensor + '/var'} variant='info'>VAR</Button>}
                <Button as={Link} to={'/' + sensor + '/random-forest'} variant='info'>Random Forest</Button>
                <Button as={Link} to={'/' + sensor + '/gradient-boosting'} variant='info'>Gradient Boosting</Button>
                <Button as={Link} to={'/' + sensor + '/nnar'} variant='info'>NNAR</Button>
                <Button as={Link} to={'/' + sensor + '/rnn'} variant='info'>RNN</Button>
                <Button as={Link} to={'/' + sensor + '/lstm'} variant='info'>LSTM</Button>
              </ButtonGroup>
            </Row>
          </Container>
        )}
      </Container>
    </>
  )
}

IniPage.propTypes = {
  sensor: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  structural: PropTypes.bool
}

export default IniPage