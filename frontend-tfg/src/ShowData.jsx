import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label, ResponsiveContainer } from 'recharts'
import { base_url_api_r } from './utils'


function ShowData({ data = [] }) {
  const [summary, setSummary] = useState(null)

  const dataToShow = data.slice(0, 6)

  useEffect(() => {
    const fetchData = () => {
      fetch(base_url_api_r + 'summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          setSummary(data)
        })
        .catch(error => console.error('Error:', error))
    }
    fetchData()
  }, [data])

  return (
    <>
      <Row className='mt-3'>
        <Col>
          <Table responsive bordered striped hover size='sm' style={{ fontSize: '14px' }}>
            <thead>
              <tr>
                <th><strong>Fecha</strong></th>
                <th><strong>Medida</strong></th>
              </tr>
            </thead>
            <tbody>
              {dataToShow.map((row, index) => (
                <tr key={index}>
                  <td>{row.Day}</td>
                  <td>{row.MEDIDA}</td>
                </tr>
              ))}
              <tr>
                <td><strong>...</strong></td>
                <td><strong>...</strong></td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <ListGroup style={{ fontSize: '14px' }}>
            {summary && Object.entries(summary).map(([key, value]) => (
              <ListGroup.Item key={key}>
                <strong>{key}</strong>: <span>{value}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart width={800} height={300} data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Line type={'monotone'} dataKey={'MEDIDA'} activeDot={{ r: 8 }} />
          <CartesianGrid strokeDasharray={'3 3'} stroke='grey' />
          <XAxis dataKey={'Day'} tick={{ fontSize: 12 }}>
            <Label value='Fecha' offset={-10} position='insideBottom' />
          </XAxis>
          <YAxis tick={{ fontSize: 12 }}>
            <Label value='Medida' angle={-90} position='insideLeft' style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip
            contentStyle={{ fontSize: '12px', backgroundColor: 'black', color: 'white' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

ShowData.propTypes = {
  data: PropTypes.array.isRequired,
}

export default ShowData