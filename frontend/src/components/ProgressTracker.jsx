import React from 'react'
import { sumHistory } from '../utils/calculations'
import { useAuth } from '../contexts/AuthContext'

export default function ProgressTracker({ history = [] }) {
  const { user } = useAuth()
  const total = sumHistory(history)
  const goal = user?.annualGoal || 2000 // kg CO2
  const percent = Math.min(100, Math.round((total / goal) * 100))

  return (
    <div className="card">
      <h3>Progress</h3>
      <div className="muted">Total emissions (kg CO2):</div>
      <h2 style={{ margin: '8px 0' }}>{total.toFixed(1)} kg</h2>
      <div className="muted">Annual goal: {goal} kg</div>
      <div style={{ marginTop: 12, background: '#eef2f6', borderRadius: 8, height: 14, overflow: 'hidden' }}>
        <div style={{ width: percent + '%', height: '100%', background: '#2b8aef' }} />
      </div>
      <div className="muted" style={{ marginTop: 8 }}>{percent}% of goal</div>
    </div>
  )
}
