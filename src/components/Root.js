import React from 'react'
import { Provider } from 'react-redux'
import router from '../router'


const Root = ({store}) => (
  <Provider store={store}>
    {router}
  </Provider>
)

export default Root
