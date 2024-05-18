import PropTypes from 'prop-types'
import { useState } from 'react'
import { DataContext } from './utils'

function DataProvider({ children }) {
  const [data, setData] = useState(null)

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  )
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DataProvider