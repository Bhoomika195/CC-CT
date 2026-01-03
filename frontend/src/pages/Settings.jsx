import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const [theme, setTheme] = useState(user?.theme || 'light')

  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme)
      document.documentElement.setAttribute('data-theme', user.theme)
    }
  }, [user?.theme])

  function change(t) {
    setTheme(t)
    updateProfile({ theme: t })
    document.documentElement.setAttribute('data-theme', t)
  }

  if (!user) return <div className="card"><div className="muted">Please sign in to change settings.</div></div>

  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <h3>Settings</h3>
      <div className="muted">App preferences synced with your account.</div>
      <div style={{ marginTop: 12 }}>
        <label className="muted">Theme:</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn" onClick={() => change('light')}>Light</button>
          <button className="btn" style={{ background: '#111827' }} onClick={() => change('dark')}>Dark</button>
        </div>
      </div>
    </div>
  )
}
