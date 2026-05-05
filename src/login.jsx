import { useState } from 'react'
import { motion } from 'framer-motion'
import "./login.css"

const USERS = [
  { id: '204726', pw: 'isp2026' },
  { id: '202326', pw: 'ens2026' },
  { id: '2026lab', pw: 'lab2026' },
]

export default function Login({ onSuccess }) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleLogin = async () => {
    setError('')

    if (!id.trim() || !pw) {
      setError('Por favor completa todos los campos.')
      triggerShake()
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)

    const user = USERS.find(u => u.id === id.trim())

    if (user && user.pw === pw) {
      onSuccess && onSuccess()
    } else {
      setError(
        !user
          ? 'ID de empleado no reconocido.'
          : 'Contraseña incorrecta.'
      )
      triggerShake()
    }
  }

  return (
    <div className="ls-root">

      {/* ── FOTO IZQUIERDA ── */}
      <motion.div
        className="ls-right"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <img src="/isp.jpg" alt="Puerto ISP" className="ls-photo" />
        <div className="ls-photo-overlay" />
      </motion.div>

      {/* ── LOGIN DERECHO ── */}
      <motion.div
        className={`ls-left${shake ? ' shake' : ''}`}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="ls-inner">

          {/* LOGO + BRAND */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e8edf2'
          }}>
            <img
              src="/logoisp.png"
              alt="ISP"
              className="ls-logo"
              style={{ margin: '0 auto 0.5rem' }}
            />
            <p className="ls-company">Infraestructura y Servicios Portuarios</p>
            <p className="ls-system">Sistema de Cursos de Inducción</p>
          </div>

          <h2 className="ls-title">Iniciar sesión</h2>
          <p className="ls-subtitle">
            Ingresa tus credenciales para acceder al sistema
          </p>

          <div className="ls-field">
            <label className="ls-label">ID de empleado</label>
            <input
              className="ls-input"
              type="text"
              placeholder="Ej. 204726"
              value={id}
              onChange={e => setId(e.target.value)}
            />
          </div>

          <div className="ls-field">
            <label className="ls-label">Contraseña</label>
            <div className="ls-input-wrap">
              <input
                className="ls-input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={pw}
                onChange={e => setPw(e.target.value)}
              />
              <button
                className="ls-eye"
                onClick={() => setShowPw(v => !v)}
                type="button"
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="ls-error">{error}</div>}

          <button
            className="ls-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Verificando…' : 'Ingresar'}
          </button>

          <p className="ls-footer">
            ISP · {new Date().getFullYear()}
          </p>

        </div>
      </motion.div>

    </div>
  )
}