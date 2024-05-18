import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
import NavBar from '../NavBar'

function NotFound({ error = 'Ocurrió un error' }) {
    return (
        <div>
            <NavBar />
            <Alert variant='danger' className='m-3'>
                <Alert.Heading>¡Ups!</Alert.Heading>
                <p>{error}</p>
            </Alert>
        </div>

    )
}

NotFound.propTypes = {
    error: PropTypes.string
}

export default NotFound