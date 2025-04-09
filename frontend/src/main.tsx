import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import { Home, SlideoutPage, TestPage } from './pages'
import { MuiTableTest} from './components'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/reacttracker" element={<ReactTable setSelectedJobIndex={()=>{}} slideIn={()=>{}} jobs={mockApiResponseAll} />} /> */}
        <Route path="/table" element={<MuiTableTest />} />
        <Route path="/slideout" element={<SlideoutPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
    </LocalizationProvider>,
)
