import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import { Home, SlideoutPage } from './pages'
import { ReactTable, MuiTableTest, EditSlideout} from './components'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reacttracker" element={<ReactTable />} />
        <Route path="/table" element={<MuiTableTest />} />
        <Route path="/slideout" element={<SlideoutPage stuff={'hello'} />} />
      </Routes>
    </Router>,
)
