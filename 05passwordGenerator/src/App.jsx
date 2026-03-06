import { useState, useCallback, useEffect } from "react"
import "./App.css"

function App() {

  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(false)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const passwordGenerator = useCallback(() => {

    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
    const numberChars = "0123456789"
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-="

    let characterPool = ""

    if (includeUppercase) characterPool += uppercaseChars
    if (includeLowercase) characterPool += lowercaseChars
    if (includeNumbers) characterPool += numberChars
    if (includeSymbols) characterPool += symbolChars

    if (characterPool === "") {
      setGeneratedPassword("")
      return
    }

    let password = ""

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length)
      password += characterPool[randomIndex]
    }

    setGeneratedPassword(password)

  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])


  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  useEffect(() => {
    passwordGenerator()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">

      <div className="w-full max-w-md bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700">

        <h1 className="text-3xl font-bold text-center text-orange-400 mb-6">
          Password Generator
        </h1>


        {/* Password Display */}

        <div className="flex items-center bg-black rounded-lg overflow-hidden mb-6 border border-gray-700">

          <input
            type="text"
            value={generatedPassword}
            readOnly
            className="flex-1 px-4 py-3 bg-transparent text-orange-400 text-lg focus:outline-none"
          />

          <button
            onClick={copyPassword}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-3 text-black font-semibold transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>

        </div>


        {/* Length Slider */}

        <div className="mb-6">

          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Password Length</span>
            <span className="text-orange-400 font-bold">{length}</span>
          </div>

          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full accent-orange-500 cursor-pointer"
          />

        </div>


        {/* Options */}

        <div className="grid grid-cols-2 gap-3 text-gray-200 text-sm">

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="accent-orange-500"
            />
            Uppercase
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="accent-orange-500"
            />
            Lowercase
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="accent-orange-500"
            />
            Numbers
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="accent-orange-500"
            />
            Symbols
          </label>

        </div>


        {/* Generate Button */}

        <button
          onClick={passwordGenerator}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-lg transition"
        >
          Generate Password
        </button>

      </div>

    </div>
  )
}

export default App