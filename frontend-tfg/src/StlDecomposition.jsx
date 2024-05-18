import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import FormatText from './FormatText'


function StlDecomposition({ sensor }) {
  const [graphic, setGraphic] = useState(null)
  const [report, setReport] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8000/stl-decomp?sensor=${sensor}`)
      .then(response => response.json())
      .then(data => {
        setGraphic(data.grafico)
        setReport(data.reporte)
      })
  }, [sensor])

  return (
    <Row>
      <Col>
        {report && (
          <>
            <h3 className='mt-3'>Reporte:</h3>
            <Card body>
              <FormatText lines={report} />
            </Card>
          </>
        )}
      </Col>
      <Col>
        {graphic && (
          <>
            <h3 className='mt-3'>Gráfico:</h3>
            <Image
              src={'data:image/png;base64,' + graphic}
              alt='Decomposed data'
              thumbnail
              style={{ width: '100%', height: '400px', objectFit: 'contain' }}
            />
          </>

        )}
      </Col>
    </Row>
  )
}

StlDecomposition.propTypes = {
  sensor: PropTypes.string.isRequired,
}

export default StlDecomposition