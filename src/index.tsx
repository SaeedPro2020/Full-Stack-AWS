import React from 'react'
import ReactDOM from 'react-dom'
import {Amplify} from 'aws-amplify'
import awsExports from './aws-exports'
// Redux
// https://github.com/rt2zz/redux-persist
import {PersistGate} from 'redux-persist/integration/react'
import {Provider} from 'react-redux'
import store, {persistor} from './setup/redux/Store'
import {Chart, registerables} from 'chart.js'

// Apps
import {App} from './app/App'
import {Demoresource} from './demoresource/i18n/Demoresource'
/**
 * TIP: Replace this style import with dark styles to enable dark mode
 **/
import './demoresource/assets/sass/style.scss'
import './demoresource/assets/sass/style.react.scss'

import awsconfig from './aws-exports'

Amplify.configure(awsconfig)
/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = process.env
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 *
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */

/**
 *
 *
 * @see https://github.com/axios/axios#interceptors
 */

Chart.register(...registerables)
Amplify.configure(awsExports)
ReactDOM.render(
  <Demoresource>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
        <App basename={PUBLIC_URL} />
      </PersistGate>
    </Provider>
  </Demoresource>,
  document.getElementById('root')
)
