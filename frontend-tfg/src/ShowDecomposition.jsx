import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import FormatText from './FormatText'


function ShowDecomposition({ sensor }) {
  const [reporte, setReporte] = useState(null)
  const [graphic, setGraphic] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8000/decompose?sensor=${sensor}`)
      .then(response => response.json())
      .then(data => {
        setGraphic(data.grafico)
        setReporte(data.reporte)
      })
  }, [sensor])

  return (
    <Row>
      <Col>
        {reporte && (
          <>
            <h3 className='mt-3'>Reporte:</h3>
            <Card body>
              <FormatText lines={reporte} />
              {/* {reporte.map((item, index) => (
                <div key={index}>{item}</div>
              ))} */}
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
              alt='Gráfico'
              thumbnail
              style={{ width: '100%', height: '400px', objectFit: 'contain' }}
            />
          </>
        )}
      </Col>
    </Row>
  )
}

ShowDecomposition.propTypes = {
  sensor: PropTypes.string.isRequired,
}

export default ShowDecomposition