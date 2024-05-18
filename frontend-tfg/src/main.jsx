import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import NotFound from './routes/NotFound.jsx'
import IniPage from './routes/IniPage.jsx'
import EtsModel from './routes/EtsModel.jsx'
import DataProvider from './DataProvider.jsx'
import ArimaModel from './routes/ArimaModel.jsx'
import VarModel from './routes/VarModel.jsx'
import RandomForestModel from './routes/RandomForestModel.jsx'
import GradientBoosting from './routes/GradientBoosting.jsx'
import NnarModel from './routes/NnarModel.jsx'
import RnnModel from './routes/RnnModel.jsx'
import LstmModel from './routes/LstmModel.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/86316A',
    element: <IniPage sensor='86316A' filePath='data/CL_86316_A.csv' />,
  },
  {
    path: '/86316A/ets',
    element: <EtsModel sensor='86316A' />
  },
  {
    path: '/86316A/arima',
    element: <ArimaModel sensor='86316A' />
  },
  {
    path: '/86316A/var',
    element: <VarModel sensor='86316A' sensor2='86318T' />
  },
  {
    path: '/86316A/random-forest',
    element: <RandomForestModel sensor='86316A' />
  },
  {
    path: '/86316A/gradient-boosting',
    element: <GradientBoosting sensor='86316A' />
  },
  {
    path: '/86316A/nnar',
    element: <NnarModel sensor='86316A' />
  },
  {
    path: '/86316A/rnn',
    element: <RnnModel sensor='86316A' />
  },
  {
    path: '/86316A/lstm',
    element: <LstmModel sensor='86316A' />
  },
  {
    path: '/86317B',
    element: <IniPage sensor='86317B' filePath='data/CL_86317_B.csv' />,
  },
  {
    path: '/86317B/ets',
    element: <EtsModel sensor='86317B' />
  },
  {
    path: '/86317B/arima',
    element: <ArimaModel sensor='86317B' />
  },
  {
    path: '/86317B/var',
    element: <VarModel sensor='86317B' sensor2='86318T' />
  },
  {
    path: '/86317B/random-forest',
    element: <RandomForestModel sensor='86317B' />
  },
  {
    path: '/86317B/gradient-boosting',
    element: <GradientBoosting sensor='86317B' />
  },
  {
    path: '/86317B/nnar',
    element: <NnarModel sensor='86317B' />
  },
  {
    path: '/86317B/rnn',
    element: <RnnModel sensor='86317B' />
  },
  {
    path: '/86317B/lstm',
    element: <LstmModel sensor='86317B' />
  },
  {
    path: '/25466X',
    element: <IniPage sensor='25466X' filePath='data/RP_25466_X.csv' />,
  },
  {
    path: '/25466X/ets',
    element: <EtsModel sensor='25466X' />
  },
  {
    path: '/25466X/arima',
    element: <ArimaModel sensor='25466X' />
  },
  {
    path: '/25466X/var',
    element: <VarModel sensor='25466X' sensor2='25555T' />
  },
  {
    path: '/25466X/random-forest',
    element: <RandomForestModel sensor='25466X' />
  },
  {
    path: '/25466X/gradient-boosting',
    element: <GradientBoosting sensor='25466X' />
  },
  {
    path: '/25466X/nnar',
    element: <NnarModel sensor='25466X' />
  },
  {
    path: '/25466X/rnn',
    element: <RnnModel sensor='25466X' />
  },
  {
    path: '/25466X/lstm',
    element: <LstmModel sensor='25466X' />
  },
  {
    path: '/25481Y',
    element: <IniPage sensor='25481Y' filePath='data/RP_25481_Y.csv' />,
  },
  {
    path: '/25481Y/ets',
    element: <EtsModel sensor='25481Y' />
  },
  {
    path: '/25481Y/arima',
    element: <ArimaModel sensor='25481Y' />
  },
  {
    path: '/25481Y/var',
    element: <VarModel sensor='25481Y' sensor2='25555T' />
  },
  {
    path: '/25481Y/random-forest',
    element: <RandomForestModel sensor='25481Y' />
  },
  {
    path: '/25481Y/gradient-boosting',
    element: <GradientBoosting sensor='25481Y' />
  },
  {
    path: '/25481Y/nnar',
    element: <NnarModel sensor='25481Y' />
  },
  {
    path: '/25481Y/rnn',
    element: <RnnModel sensor='25481Y' />
  },
  {
    path: '/25481Y/lstm',
    element: <LstmModel sensor='25481Y' />
  },
  {
    path: '/HN43576',
    element: <IniPage sensor='HN43576' filePath='data/HN_43567.csv' structural={false} />,
  },
  {
    path: '/HN43576/ets',
    element: <EtsModel sensor='HN43576' />
  },
  {
    path: '/HN43576/arima',
    element: <ArimaModel sensor='HN43576' />
  },
  {
    path: '/HN43576/random-forest',
    element: <RandomForestModel sensor='HN43576' />
  },
  {
    path: '/HN43576/gradient-boosting',
    element: <GradientBoosting sensor='HN43576' />
  },
  {
    path: '/HN43576/nnar',
    element: <NnarModel sensor='HN43576' />
  },
  {
    path: '/HN43576/rnn',
    element: <RnnModel sensor='HN43576' />
  },
  {
    path: '/HN43576/lstm',
    element: <LstmModel sensor='HN43576' />
  },
  {
    path: '/HN53842',
    element: <IniPage sensor='HN53842' filePath='data/HN_53842.csv' structural={false} />,
  },
  {
    path: '/HN53842/ets',
    element: <EtsModel sensor='HN53842' />
  },
  {
    path: '/HN53842/arima',
    element: <ArimaModel sensor='HN53842' />
  },
  {
    path: '/HN53842/random-forest',
    element: <RandomForestModel sensor='HN53842' />
  },
  {
    path: '/HN53842/gradient-boosting',
    element: <GradientBoosting sensor='HN53842' />
  },
  {
    path: '/HN53842/nnar',
    element: <NnarModel sensor='HN53842' />
  },
  {
    path: '/HN53842/rnn',
    element: <RnnModel sensor='HN53842' />
  },
  {
    path: '/HN53842/lstm',
    element: <LstmModel sensor='HN53842' />
  },
  {
    path: '/HNP86142',
    element: <IniPage sensor='HNP86142' filePath='data/HNP_86142.csv' structural={false} />,
  },
  {
    path: '/HNP86142/ets',
    element: <EtsModel sensor='HNP86142' />
  },
  {
    path: '/HNP86142/arima',
    element: <ArimaModel sensor='HNP86142' />
  },
  {
    path: '/HNP86142/random-forest',
    element: <RandomForestModel sensor='HNP86142' />
  },
  {
    path: '/HNP86142/gradient-boosting',
    element: <GradientBoosting sensor='HNP86142' />
  },
  {
    path: '/HNP86142/nnar',
    element: <NnarModel sensor='HNP86142' />
  },
  {
    path: '/HNP86142/rnn',
    element: <RnnModel sensor='HNP86142' />
  },
  {
    path: '/HNP86142/lstm',
    element: <LstmModel sensor='HNP86142' />
  },
  {
    path: '/PZ68476',
    element: <IniPage sensor='PZ68476' filePath='data/PZ_68476.csv' structural={false} />,
  },
  {
    path: '/PZ68476/ets',
    element: <EtsModel sensor='PZ68476' />
  },
  {
    path: '/PZ68476/arima',
    element: <ArimaModel sensor='PZ68476' />
  },
  {
    path: '/PZ68476/random-forest',
    element: <RandomForestModel sensor='PZ68476' />
  },
  {
    path: '/PZ68476/gradient-boosting',
    element: <GradientBoosting sensor='PZ68476' />
  },
  {
    path: '/PZ68476/nnar',
    element: <NnarModel sensor='PZ68476' />
  },
  {
    path: '/PZ68476/rnn',
    element: <RnnModel sensor='PZ68476' />
  },
  {
    path: '/PZ68476/lstm',
    element: <LstmModel sensor='PZ68476' />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </React.StrictMode>
)
