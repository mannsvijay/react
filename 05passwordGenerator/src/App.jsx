import { useState, useCallback, useEffect, useRef } from 'react';

function App() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Fallback to ensure at least one option is selected
  const hasSelectedOption = includeUppercase || includeLowercase || includeNumbers || includeSymbols;

  const passwordGenerator = useCallback(() => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let characterPool = '';
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeLowercase) characterPool += lowercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSymbols) characterPool += symbolChars;

    // Failsafe: if nothing is checked, default to lowercase
    if (characterPool.length === 0) characterPool = lowercaseChars;

    let password = '';
    for (let i = 1; i <= length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      password += characterPool[randomIndex];
    }
    setGeneratedPassword(password);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Auto-generate password when dependencies change
  useEffect(() => {
    passwordGenerator();
  }, [passwordGenerator]);

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Calculate a basic strength score (0-4)
  const calculateStrength = () => {
    let score = 0;
    if (length >= 10) score += 1;
    if (includeUppercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;
    return score;
  };

  const strengthScore = calculateStrength();

  return (
    // Outer wrapper using Color 4 (Cream) for a soft background
    <div className="min-h-screen flex items-center justify-center bg-[#EAE4CE] p-4 font-sans transition-all">
      
      {/* Main Card using Color 1 (Darkest) */}
      <div className="w-full max-w-md bg-[#1A1412] rounded-2xl shadow-2xl p-6 md:p-8 text-[#EAE4CE]">
        <h1 className="text-3xl font-bold mb-8 text-center tracking-wide text-[#D5CBAE]">
          Password Generator
        </h1>

        {/* Output & Copy Section */}
        <div className="relative mb-6">
          <div className="flex bg-[#42342A] rounded-xl overflow-hidden p-2 items-center shadow-inner border border-[#42342A] focus-within:border-[#D5CBAE] transition-colors">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="flex-1 w-full bg-transparent px-3 py-2 outline-none text-xl tracking-wider text-[#EAE4CE] placeholder-[#D5CBAE] opacity-90"
            />
            <button
              onClick={copyToClipboard}
              className={`px-5 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 ${
                copySuccess 
                  ? 'bg-green-600 text-white' 
                  : 'bg-[#D5CBAE] hover:bg-[#EAE4CE] text-[#1A1412]'
              }`}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm uppercase tracking-widest text-[#D5CBAE] opacity-80">Strength</span>
            <span className="text-sm font-bold tracking-widest uppercase">
              {strengthScore <= 1 ? 'Weak' : strengthScore === 2 ? 'Fair' : strengthScore === 3 ? 'Good' : 'Strong'}
            </span>
          </div>
          <div className="h-2 w-full bg-[#42342A] rounded-full overflow-hidden flex gap-1">
            <div className={`h-full transition-all duration-500 ${strengthScore >= 1 ? 'w-1/4 bg-[#D5CBAE]' : 'w-0'}`}></div>
            <div className={`h-full transition-all duration-500 ${strengthScore >= 2 ? 'w-1/4 bg-[#D5CBAE]' : 'w-0'}`}></div>
            <div className={`h-full transition-all duration-500 ${strengthScore >= 3 ? 'w-1/4 bg-[#D5CBAE]' : 'w-0'}`}></div>
            <div className={`h-full transition-all duration-500 ${strengthScore >= 4 ? 'w-1/4 bg-[#EAE4CE]' : 'w-0'}`}></div>
          </div>
        </div>

        <hr className="border-[#42342A] mb-8" />

        {/* Controls Section */}
        <div className="space-y-6">
          {/* Slider */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium text-[#D5CBAE]">Character Length</label>
              <span className="text-2xl font-bold text-[#EAE4CE]">{length}</span>
            </div>
            <input
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-[#42342A] rounded-lg appearance-none cursor-pointer accent-[#D5CBAE]"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 pt-4">
            <CheckboxOption 
              label="Include Uppercase Letters" 
              checked={includeUppercase} 
              onChange={(e) => setIncludeUppercase(e.target.checked)} 
            />
            <CheckboxOption 
              label="Include Lowercase Letters" 
              checked={includeLowercase} 
              onChange={(e) => setIncludeLowercase(e.target.checked)} 
            />
            <CheckboxOption 
              label="Include Numbers" 
              checked={includeNumbers} 
              onChange={(e) => setIncludeNumbers(e.target.checked)} 
            />
            <CheckboxOption 
              label="Include Symbols" 
              checked={includeSymbols} 
              onChange={(e) => setIncludeSymbols(e.target.checked)} 
            />
            {!hasSelectedOption && (
              <p className="text-red-400 text-xs mt-2 text-center">
                Please select at least one character type.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracted Checkbox Component for cleaner code
function CheckboxOption({ label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-4 cursor-pointer group">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer appearance-none w-6 h-6 border-2 border-[#D5CBAE] rounded-md bg-transparent checked:bg-[#D5CBAE] checked:border-[#D5CBAE] transition-all cursor-pointer"
        />
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1412] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-[#EAE4CE] group-hover:text-[#D5CBAE] transition-colors select-none">
        {label}
      </span>
    </label>
  );
}

export default App;