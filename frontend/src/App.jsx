import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CalculatorPage from './pages/CalculatorPage'
import HistoryPage from './pages/HistoryPage'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import api from './utils/api'
import { useAuth } from './contexts/AuthContext'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container" style={{ padding: 24 }}>
        Loading...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [history, setHistory] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchHistory()
    } else {
      setHistory([])
    }
  }, [user])

  async function fetchHistory() {
    try {
      const { data } = await api.get('/entries')
      setHistory(data)
    } catch (err) {
      console.error('Error fetching history:', err)
    }
  }

  async function addEntry(entry) {
    try {
      const { data } = await api.post('/entries', entry)
      setHistory(prev => [data, ...prev])
    } catch (err) {
      console.error('Error adding entry:', err)
    }
  }

  async function updateEntry(id, entry) {
    try {
      const { data } = await api.put(`/entries/${id}`, entry)
      setHistory(prev => prev.map(p => (p._id === id ? data : p)))
    } catch (err) {
      console.error('Error updating entry:', err)
    }
  }

  async function deleteEntry(id) {
    try {
      await api.delete(`/entries/${id}`)
      setHistory(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      console.error('Error deleting entry:', err)
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard history={history} />
              </PrivateRoute>
            }
          />
          <Route
            path="/calculator"
            element={
              <PrivateRoute>
                <CalculatorPage onAdd={addEntry} />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage
                  history={history}
                  onEdit={updateEntry}
                  onDelete={deleteEntry}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
