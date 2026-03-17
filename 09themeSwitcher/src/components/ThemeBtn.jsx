import React from 'react'
import useTheme from '../contexts/theme';

export default function ThemeBtn() {
    const { themeMode, lightTheme, darkTheme } = useTheme()

    const onChangeBtn = (e) => {
        const darkModeStatus = e.currentTarget.checked
        if(darkModeStatus) darkTheme()
        else lightTheme()
    }

    return (
        <label className="relative inline-flex items-center cursor-pointer group">
            <input
                type="checkbox"
                className="sr-only peer"
                onChange={onChangeBtn}
                checked={themeMode === "dark"}
            />
            <div className="flex items-center gap-4 text-2xl font-display uppercase">
              <span className={`transition-opacity duration-500 ${themeMode === 'light' ? 'opacity-100 text-[var(--accent)]' : 'opacity-30'}`}>
                Light
              </span>
              
              {/* Brutalist Custom Track */}
              <div className="relative w-16 h-8 border-[3px] border-[var(--border-color)] overflow-hidden bg-[var(--card-bg)]">
                <div 
                  className={`absolute top-0 bottom-0 w-1/2 bg-[var(--accent)] transition-all duration-[850ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${themeMode === 'dark' ? 'translate-x-full' : 'translate-x-0'}`}
                ></div>
              </div>

              <span className={`transition-opacity duration-500 ${themeMode === 'dark' ? 'opacity-100 text-[var(--accent)]' : 'opacity-30'}`}>
                Dark
              </span>
            </div>
        </label>
    );
}