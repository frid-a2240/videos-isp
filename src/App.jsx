import './App.css'
import { useState, useRef } from 'react'
import { Users, Leaf, Award, HardHat, Anchor, Play, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Login from './login.jsx'

// ── ESTRUCTURA DE CARPETAS ──
const folders = [
  {
    id: 1,
    title: 'RH',
    icon: Users,
    color: 'folder-blue',
    videos: [
      { id: 1, src: '/videos/rh.mp4', titulo: 'Inducción de Recursos Humanos', duracion: '45s' },
    ],
  },
  {
    id: 2,
    title: 'SGA',
    icon: Leaf,
    color: 'folder-amber',
    videos: [
      { id: 1, src: '/videos/sga.mp4', titulo: 'Sistema de Gestión Ambiental', duracion: '6s' },
    ],
  },
  {
    id: 3,
    title: 'SGC',
    icon: Award,
    color: 'folder-rose',
    videos: [
      { id: 1, src: '/videos/sgc.mp4', titulo: 'Sistema de Gestión de Calidad', duracion: '27s' },
    ],
  },
  {
    id: 4,
    title: 'SGSST',
    icon: HardHat,
    color: 'folder-teal',
    videos: [
      { id: 1, src: '/videos/sgsst.mp4', titulo: 'Sistema de Gestión de Seguridad y Salud en el Trabajo', duracion: '81s' },
    ],
  },
  {
    id: 5,
    title: 'PBIP',
    icon: Anchor,
    color: 'folder-blue',
    videos: [
      { id: 1, src: '/videos/pbip.mp4', titulo: 'Protección Portuaria (PBIP)', duracion: '36s' },
    ],
  },
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const videoRefs = useRef({})

  const currentFolder = folders.find(f => f.id === selectedFolder)
  const currentVideo = currentFolder?.videos.find(v => v.id === selectedVideo)
  const isDashboardView = currentFolder?.tipo === 'powerbi'

  const goBack = () => {
    setSelectedFolder(null)
    setSelectedVideo(null)
  }

  const handleLogout = () => {
    setSelectedFolder(null)
    setSelectedVideo(null)
    setIsLoggedIn(false)
  }

  // ── PANTALLA DE LOGIN ──
  if (!isLoggedIn) {
    return (
      <AnimatePresence>
        <Login onSuccess={() => setIsLoggedIn(true)} />
      </AnimatePresence>
    )
  }

  // ── APP PRINCIPAL ──
  return (
    <motion.div
      className="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ENCABEZADO CENTRADO (oculto en vista dashboard) */}
      {!isDashboardView && (
        <header className="topbar">
          <div className="topbar-inner">
            <img src="/logoisp.png" alt="ISP" className="logo" />
            <h1 className="topbar-title">Infraestructura y Servicios Portuarios</h1>
            <p className="topbar-subtitle">
              Sistema de <span>Cursos de Inducción</span>
            </p>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </header>
      )}

      {/* CONTENIDO: CARPETAS o REPRODUCTOR */}
      <main className="main">
        <AnimatePresence mode="wait">
          {!selectedFolder ? (
            // ── VISTA 1: GRID DE CARPETAS ──
            <motion.div
              key="folders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="folders-section"
            >
              <div className="folders-grid">
                {folders.map((folder, index) => (
                  <motion.button
                    key={folder.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`folder-card ${folder.color}`}
                  >
                    <div className={`folder-icon-wrap ${folder.color}`}>
                      <folder.icon className="folder-icon" />
                    </div>
                    <span className="folder-title">{folder.title}</span>
                    <span className="folder-count">
                      {folder.videos.length} {folder.tipo === 'powerbi' ? 'dashboard' : 'video'}
                      {folder.videos.length !== 1 ? 's' : ''}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            // ── VISTA 2: REPRODUCTOR / DASHBOARD ──
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="player-wrap"
            >
              <div className="player-topbar">
                <button className="btn-back" onClick={goBack}>
                  <ArrowLeft size={18} />
                  Volver
                </button>
                <h2 className="player-folder-name">{currentFolder?.title}</h2>
              </div>

              {currentFolder?.tipo === 'powerbi' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="dashboard-fullwrap"
                >
                  <iframe
                    title={currentFolder.videos[0].titulo}
                    src={currentFolder.videos[0].src}
                    className="dashboard-iframe"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </motion.div>
              ) : (
                <div className="player-split">
                  {/* Lista de videos (izquierda) */}
                  <motion.aside
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                    className="player-sidebar"
                  >
                    <h3 className="sidebar-title">Lista de Videos</h3>
                    {currentFolder?.videos.length === 0 ? (
                      <div className="empty-state">Aún no hay videos en esta carpeta.</div>
                    ) : (
                      <div className="video-list">
                        {currentFolder?.videos.map((video, index) => (
                          <motion.button
                            key={video.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.25 + index * 0.08, ease: 'easeOut' }}
                            onClick={() => setSelectedVideo(video.id)}
                            className={`video-list-item ${selectedVideo === video.id ? 'active' : ''}`}
                          >
                            <div className="video-list-icon">
                              <Play size={14} />
                            </div>
                            <div className="video-list-meta">
                              <p className="video-list-title">{video.titulo}</p>
                              <p className="video-list-sub">Duración: {video.duracion}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.aside>

                  {/* Reproductor (derecha) */}
                  <motion.section
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
                    className="player-main"
                  >
                    {selectedVideo && currentVideo ? (
                      <div className="player-active">
                        <div className="player-video-box">
                          <video
                            key={currentVideo.src}
                            ref={el => (videoRefs.current[currentVideo.id] = el)}
                            controls
                            autoPlay
                            className="player-video"
                          >
                            <source src={currentVideo.src} type="video/mp4" />
                          </video>
                        </div>
                        <div className="player-info">
                          <h2>{currentVideo.titulo}</h2>
                          <p>Duración: {currentVideo.duracion}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="player-placeholder">
                        <div className="placeholder-icon">
                          <Play size={32} />
                        </div>
                        <h3>Selecciona un video</h3>
                        <p>Elige un video de la lista para comenzar a reproducirlo</p>
                      </div>
                    )}
                  </motion.section>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  )
}