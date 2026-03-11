import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import ManageEvents from './pages/ManageEvents.tsx'
import TrackEvents from './pages/TrackEvents.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>Event Counter</h1>
          <nav>
            <NavLink to="/" end>Track</NavLink>
            <NavLink to="/manage">Manage</NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<TrackEvents />} />
            <Route path="/manage" element={<ManageEvents />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
