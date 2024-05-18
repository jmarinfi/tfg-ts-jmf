import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Spinner from 'react-bootstrap/Spinner'
import FormatText from './FormatText'


function ShowForecast({ baseUrl, relUrl }) {
  const [forecast, setForecast] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setForecast(null)
    setReport(null)

    fetch(`${baseUrl}${relUrl}`)
      .then(response => response.json())
      .then(data => {
        setForecast(data.grafico)
        setReport(data.reporte)
        setLoading(false)
      })
  }, [baseUrl, relUrl])

  return (
    <Row>
      {loading && <ProgressBar animated now={100} className='mt-3' />}
      <Col>
        {loading && <Spinner animation='grow' className='mt-3' />}
        {report && <h3 className='mt-3'>Reporte:</h3>}
        {report && <Card body style={{ maxWidth: '600px', fontSize: '14px' }}>
          <FormatText lines={report} />
        </Card>}
      </Col>
      <Col>
        {loading && <Spinner animation='grow' className='mt-3' />}
        {forecast && <h3 className='mt-3'>Gráfico:</h3>}
        {forecast && <Image src={'data:image/png;base64,' + forecast} alt='Gráfico' thumbnail />}
      </Col>
    </Row>
  )
}

ShowForecast.propTypes = {
  relUrl: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired
}

export default ShowForecast