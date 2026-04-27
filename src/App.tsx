import { BackgroundBeams } from './components/ui/background-beams'
import FlightsList from './components/FlightsList'
import ThemeToggle from './components/ThemeToggle'
import { useTheme } from './context/ThemeContext'
import './App.css'

export default function App() {
  const { theme } = useTheme()
  
  return (
    <div 
      className="min-h-screen relative z-10 transition-colors duration-300"
      style={{
        backgroundColor: theme === 'dark' ? '#000000' : '#f8fafc',
        color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
      }}
    >
      <BackgroundBeams />
      <ThemeToggle />
      <main>
        <FlightsList />
      </main>
    </div>
  )
}
