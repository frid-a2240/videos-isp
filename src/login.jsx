import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import "./login.css"

const VALID_ID = '204726'
const VALID_PW = 'isp2026'

export default function Login({ onSuccess }) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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
    await new Promise(r => setTimeout(r, 950))
    setLoading(false)
    if (id.trim() === VALID_ID && pw === VALID_PW) {
      setSuccess(true)
      setTimeout(() => onSuccess && onSuccess(), 1800)
    } else {
      setError(id.trim() !== VALID_ID ? 'ID de empleado no reconocido.' : 'Contraseña incorrecta. Inténtalo de nuevo.')
      triggerShake()
    }
  }

  const handleKeyDown = (e, next) => {
    if (e.key === 'Enter') {
      if (next === 'pw') document.getElementById('inp-pw').focus()
      if (next === 'submit') handleLogin()
    }
  }

  return (
    <div className="ls-root">

      {/* ── LADO IZQUIERDO: formulario ── */}
      <motion.div
        className={`ls-left${shake ? ' shake' : ''}`}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="ls-inner">

          <div className="ls-brand">
            <img src="/logoisp.png" alt="ISP" className="ls-logo" />
            <div>
              <p className="ls-company">Infraestructura y Servicios Portuarios</p>
              <p className="ls-system">Sistema de Cursos de Inducción</p>
            </div>
          </div>

          <div className="ls-divider" />

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="ls-title">Iniciar sesión</h2>
                <p className="ls-subtitle">Ingresa tus credenciales para acceder</p>

                <div className="ls-field">
                  <label className="ls-label" htmlFor="inp-id">ID de empleado</label>
                  <div className="ls-input-wrap">
                    <span className="ls-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input
                      id="inp-id"
                      className="ls-input"
                      type="text"
                      placeholder="Ej. 204726"
                      maxLength={12}
                      autoComplete="off"
                      value={id}
                      onChange={e => { setId(e.target.value); setError('') }}
                      onKeyDown={e => handleKeyDown(e, 'pw')}
                    />
                  </div>
                </div>

                <div className="ls-field">
                  <label className="ls-label" htmlFor="inp-pw">Contraseña</label>
                  <div className="ls-input-wrap">
                    <span className="ls-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      id="inp-pw"
                      className="ls-input"
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="off"
                      value={pw}
                      onChange={e => { setPw(e.target.value); setError('') }}
                      onKeyDown={e => handleKeyDown(e, 'submit')}
                    />
                    <button className="ls-eye" tabIndex={-1} onClick={() => setShowPw(v => !v)} type="button">
                      {showPw ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="ls-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  className="ls-btn"
                  onClick={handleLogin}
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? (
                    <>
                      <svg className="ls-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Verificando…
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                      Ingresar al sistema
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                className="ls-success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="ls-success-circle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f8c95" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </motion.div>
                <p className="ls-success-title">Acceso concedido</p>
                <p className="ls-success-sub">Bienvenido al sistema de cursos de inducción</p>
                <div className="ls-progress">
                  <motion.div
                    className="ls-progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="ls-footer">ISP · {new Date().getFullYear()} · Acceso restringido</p>
        </div>
      </motion.div>

      {/* ── LADO DERECHO: foto ── */}
      <motion.div
        className="ls-right"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src="/isp.jpg" alt="Puerto ISP" className="ls-photo" />
        <div className="ls-photo-overlay" />
        <div className="ls-caption">
          
        </div>
      </motion.div>

    </div>
  )
}