import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import { Home, SlideoutPage } from './pages'
import { ReactTable, MuiTableTest} from './components'
import {mockApiResponseAll} from "@mocks/mockApiResponseAll";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reacttracker" element={<ReactTable setSelectedJobIndex={()=>{}} toggleSlideoutFunction={()=>{}} jobs={mockApiResponseAll} />} />
        <Route path="/table" element={<MuiTableTest />} />
        <Route path="/slideout" element={<SlideoutPage />} />
      </Routes>
    </Router>,
)
