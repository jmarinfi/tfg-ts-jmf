import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { LineChart, CartesianGrid, XAxis, YAxis, Label, Tooltip, Line, Legend, ResponsiveContainer } from 'recharts'


function ShowSeries({ sensor1, sensor2 }) {
  const [combinedData, setCombinedData] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8000/combine-sensors?sensor1=${sensor1}&sensor2=${sensor2}`)
      .then(response => response.json())
      .then(data => setCombinedData(data))
  }, [sensor1, sensor2])

  return (
    <Row>
      <Col>
        {combinedData && (
          <ResponsiveContainer width='100%' height={400}>
            <LineChart
              data={combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray={'3 3'} stroke='grey' />
              <XAxis dataKey={'Day'} tick={{ fontSize: 12 }}>
                <Label value='Fecha' offset={-10} position='insideBottom' />
              </XAxis>
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
              >
                <Label
                  value='Medida'
                  angle={-90}
                  position='insideLeft'
                  style={{ textAnchor: 'middle' }}
                />
              </YAxis>
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip contentStyle={{ fontSize: '12px', backgroundColor: 'black', color: 'white' }} labelStyle={{ fontWeight: 'bold' }} />
              <Line
                type='monotone'
                dataKey='MEDIDA'
                stroke='DodgerBlue'
                activeDot={{ r: 8 }}
                yAxisId="left"
              />
              <Line
                type='monotone'
                dataKey={'MEDIDA_temp'}
                stroke='MediumSeaGreen'
                activeDot={{ r: 8 }}
                yAxisId="right"
              />
              <Legend layout='vertical' align='right' verticalAlign='middle' />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Col>
    </Row>
  )
}

ShowSeries.propTypes = {
  sensor1: PropTypes.string.isRequired,
  sensor2: PropTypes.string.isRequired
}

export default ShowSeries