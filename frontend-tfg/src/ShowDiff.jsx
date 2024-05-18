import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import FormatText from './FormatText'

function ShowDiff({ sensor }) {
  const [report, setReport] = useState(null)
  const [graphic, setGraphic] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8000/diff?sensor=${sensor}`)
      .then(response => response.json())
      .then(data => {
        setReport(data.reporte)
        setGraphic(data.grafico)
      })
  }, [sensor])

  return (
    <Row>
      <Col>
        {report && <h3 className='mt-3'>Reporte:</h3>}
        {report && <Card body style={{ maxWidth: '600px', fontSize: '14px' }}>
          <FormatText lines={report} />
        </Card>}
      </Col>
      <Col>
        {graphic && (
          <Image
            src={'data:image/png;base64,' + graphic}
            alt='Gráfico'
            thumbnail
            className='mt-3'
            style={{ width: '100%', height: '400px', objectFit: 'contain' }}
          />
        )}
      </Col>
    </Row>
  )
}

ShowDiff.propTypes = {
  sensor: PropTypes.string.isRequired,
}

export default ShowDiff