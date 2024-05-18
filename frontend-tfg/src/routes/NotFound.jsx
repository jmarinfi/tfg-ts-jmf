import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
import NavBar from '../NavBar'

function NotFound({ error = 'La página que buscas no existe' }) {
    return (
        <div>
            <NavBar />
            <Alert variant='danger' className='m-3'>
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
            </Alert>
        </div>

    )
}

NotFound.propTypes = {
    error: PropTypes.string
}

export default NotFound