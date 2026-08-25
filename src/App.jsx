import './App.css'
import { useState, useEffect } from 'react'
import { Users, Leaf, Award, HardHat, Anchor, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Login from './login.jsx'

// ── DIAPOSITIVAS ──
// Vite importa cada imagen y genera su URL final (respeta el base /induccion/
// en el build, igual que las fuentes), ordenadas por el número del archivo.
const slideModules = import.meta.glob('./assets/slides/*/*.jpg', { eager: true, import: 'default' })

function slidesFor(folderKey) {
  return Object.keys(slideModules)
    .filter((path) => path.includes(`/assets/slides/${folderKey}/`))
    .sort((a, b) => {
      const numA = Number(a.match(/(\d+)\.jpg$/)[1])
      const numB = Number(b.match(/(\d+)\.jpg$/)[1])
      return numA - numB
    })
    .map((path) => slideModules[path])
}

const folders = [
  { id: 1, title: 'RH', icon: Users, color: 'folder-blue', slides: slidesFor('rh') },
  { id: 2, title: 'SGA', icon: Leaf, color: 'folder-amber', slides: slidesFor('sga') },
  { id: 3, title: 'SGC', icon: Award, color: 'folder-rose', slides: slidesFor('sgc') },
  { id: 4, title: 'SGSST', icon: HardHat, color: 'folder-teal', slides: slidesFor('sgsst') },
  { id: 5, title: 'PBIP', icon: Anchor, color: 'folder-blue', slides: slidesFor('pbip') },
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const currentFolder = folders.find(f => f.id === selectedFolder)
  const currentSlides = currentFolder?.slides || []
  const totalSlides = currentSlides.length
  const isDashboardView = currentFolder?.tipo === 'powerbi'

  const openFolder = (id) => {
    setSelectedFolder(id)
    setSlideIndex(0)
    setDirection(0)
  }

  const goBack = () => {
    setSelectedFolder(null)
    setSlideIndex(0)
  }

  const handleLogout = () => {
    setSelectedFolder(null)
    setSlideIndex(0)
    setIsLoggedIn(false)
  }

  const goToNext = () => {
    if (slideIndex >= totalSlides - 1) return
    setDirection(1)
    setSlideIndex((i) => i + 1)
  }

  const goToPrev = () => {
    if (slideIndex <= 0) return
    setDirection(-1)
    setSlideIndex((i) => i - 1)
  }

  // Flechas del teclado para avanzar/retroceder diapositiva
  useEffect(() => {
    if (!selectedFolder || isDashboardView) return
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'ArrowLeft') goToPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedFolder, slideIndex, totalSlides, isDashboardView])

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
            <img src={`${import.meta.env.BASE_URL}logoisp.png`} alt="ISP" className="logo" />
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

      {/* CONTENIDO: CARPETAS o DIAPOSITIVAS */}
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
                    onClick={() => openFolder(folder.id)}
                    className={`folder-card ${folder.color}`}
                  >
                    <div className={`folder-icon-wrap ${folder.color}`}>
                      <folder.icon className="folder-icon" />
                    </div>
                    <span className="folder-title">{folder.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            // ── VISTA 2: DIAPOSITIVAS / DASHBOARD ──
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

              {isDashboardView ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="dashboard-fullwrap"
                >
                  <iframe
                    title={currentFolder.title}
                    src={currentFolder.slides[0]}
                    className="dashboard-iframe"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </motion.div>
              ) : totalSlides === 0 ? (
                <div className="empty-state">Aún no hay diapositivas en esta carpeta.</div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                  className="slideshow"
                >
                  <div className="slideshow-stage">
                    <button
                      className="slideshow-arrow slideshow-arrow-left"
                      onClick={goToPrev}
                      disabled={slideIndex === 0}
                      aria-label="Diapositiva anterior"
                    >
                      <ChevronLeft size={26} />
                    </button>

                    <div className="slideshow-image-wrap">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.img
                          key={slideIndex}
                          src={currentSlides[slideIndex]}
                          alt={`${currentFolder?.title} - diapositiva ${slideIndex + 1}`}
                          className="slideshow-image"
                          custom={direction}
                          initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                        />
                      </AnimatePresence>
                    </div>

                    <button
                      className="slideshow-arrow slideshow-arrow-right"
                      onClick={goToNext}
                      disabled={slideIndex === totalSlides - 1}
                      aria-label="Siguiente diapositiva"
                    >
                      <ChevronRight size={26} />
                    </button>
                  </div>

                  <div className="slideshow-footer">
                    <span className="slideshow-counter">
                      Diapositiva {slideIndex + 1} de {totalSlides}
                    </span>
                    <div className="slideshow-progress">
                      <div
                        className="slideshow-progress-fill"
                        style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  )
}
