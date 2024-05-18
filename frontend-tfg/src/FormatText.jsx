import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'


function FormatText({ lines }) {
  const formattedLines = lines.map((line, index) => (
    <tr key={index}>
      <td>{line}</td>
    </tr>
  ))
  return (
    <Table striped bordered hover size='sm'>
      <tbody>
        {formattedLines}
      </tbody>
    </Table>
  )
}

FormatText.propTypes = {
  lines: PropTypes.array.isRequired
}

export default FormatText