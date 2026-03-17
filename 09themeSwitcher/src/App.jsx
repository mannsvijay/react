import { useEffect, useState } from 'react'
import './index.css'
import { ThemeProvider } from './contexts/theme'
import ThemeBtn from './components/ThemeBtn'
import Card from './components/Card'

function App() {
 const [themeMode, setThemeMode] = useState("dark") // Start dark for maximum impact

 const lightTheme = () => setThemeMode("light");
 const darkTheme = () => setThemeMode("dark");

 useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
 }, [themeMode])
 
  return (
    <ThemeProvider value={{themeMode, lightTheme, darkTheme}}>
      <div className="relative min-h-screen flex flex-col justify-center items-center py-24 px-6 md:px-12">
        
        {/* Massive Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.08] select-none z-0 overflow-hidden">
          <h1 className="font-display text-[35vw] leading-none text-center whitespace-nowrap text-[var(--accent)]">
            
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col">
            {/* Header / Nav Area */}
            <div className="w-full flex flex-col md:flex-row justify-between md:items-end border-b-[3px] border-[var(--border-color)] pb-8 mb-16 animate-fade-up">
                <div className="mb-6 md:mb-0">
                  <h2 className="font-display text-6xl md:text-8xl uppercase leading-none m-0">
                    mannsvijay <br/> <span className="text-[var(--accent)]">Studio</span>
                  </h2>
                  <p className="mt-4 text-xs md:text-sm tracking-[0.2em] uppercase font-bold opacity-70">
                  </p>
                </div>
                <div className="pb-2">
                  <ThemeBtn />
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full max-w-lg mx-auto md:mx-0 animate-fade-up delay-200">
                <Card />
            </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App