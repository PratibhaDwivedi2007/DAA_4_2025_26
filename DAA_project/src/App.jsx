import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { naiveSearch, kmpSearch, boyerMooreSearch, rabinKarpSearch } from './algorithms';

const ALGORITHMS = {
  Naive: naiveSearch,
  'Knuth-Morris-Pratt': kmpSearch,
  'Boyer-Moore': boyerMooreSearch,
  'Rabin-Karp': rabinKarpSearch,
};

const ALGORITHM_CODE = {
  Naive: `function naiveSearch(haystack, needle) {
  let occurrences = 0;
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let j = 0;
    while (j < needle.length) {
      if (haystack[i + j] !== needle[j]) break;
      j++;
    }
    if (j === needle.length) occurrences++;
  }
  return occurrences;
}`,
  'Knuth-Morris-Pratt': `function kmpSearch(haystack, needle) {
  // Build LPS array
  const lps = new Array(needle.length).fill(0);
  let len = 0, i = 1;
  while (i < needle.length) {
    if (needle[i] === needle[len]) {
      len++; lps[i] = len; i++;
    } else if (len !== 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0; i++;
    }
  }

  // Search
  i = 0; let j = 0;
  let occurrences = 0;
  while (i < haystack.length) {
    if (haystack[i] === needle[j]) { i++; j++; }
    if (j === needle.length) {
      occurrences++;
      j = lps[j - 1];
    } else if (i < haystack.length && haystack[i] !== needle[j]) {
      if (j !== 0) j = lps[j - 1];
      else i++;
    }
  }
  return occurrences;
}`,
  'Boyer-Moore': `function boyerMooreSearch(haystack, needle) {
  const badChar = new Map();
  for (let i = 0; i < needle.length; i++) {
    badChar.set(needle[i], i);
  }

  let s = 0, occurrences = 0;
  while (s <= haystack.length - needle.length) {
    let j = needle.length - 1;
    while (j >= 0 && needle[j] === haystack[s + j]) j--;
    if (j < 0) {
      occurrences++;
      s += (s + needle.length < haystack.length) ? 
        needle.length - (badChar.get(haystack[s + needle.length]) ?? -1) : 1;
    } else {
      s += Math.max(1, j - (badChar.get(haystack[s + j]) ?? -1));
    }
  }
  return occurrences;
}`,
  'Rabin-Karp': `function rabinKarpSearch(haystack, needle) {
  const d = 256, q = 101;
  let M = needle.length, N = haystack.length;
  let p = 0, t = 0, h = 1, occurrences = 0;

  for (let i = 0; i < M - 1; i++) h = (h * d) % q;
  for (let i = 0; i < M; i++) {
    p = (d * p + needle.charCodeAt(i)) % q;
    t = (d * t + haystack.charCodeAt(i)) % q;
  }

  for (let i = 0; i <= N - M; i++) {
    if (p === t) {
      let j = 0;
      for (j = 0; j < M; j++) {
        if (haystack[i + j] !== needle[j]) break;
      }
      if (j === M) occurrences++;
    }
    if (i < N - M) {
      t = (d * (t - haystack.charCodeAt(i) * h) + haystack.charCodeAt(i + M)) % q;
      if (t < 0) t = t + q;
    }
  }
  return occurrences;
}`
};

function App() {
  const [algorithm, setAlgorithm] = useState('Naive');
  const [haystack, setHaystack] = useState('XZY ABCDABCDABDE');
  const [needle, setNeedle] = useState('ABCDABD');
  const [speed, setSpeed] = useState(500);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [searchTime, setSearchTime] = useState(null);

  const playRef = useRef(null);

  const startSearch = () => {
    if (!haystack || !needle) return;
    
    setIsPlaying(false);
    clearInterval(playRef.current);
    
    const algoFn = ALGORITHMS[algorithm];
    const startTime = performance.now();
    const resultSteps = algoFn(haystack, needle);
    const endTime = performance.now();
    
    setSearchTime((endTime - startTime).toFixed(3));
    setSteps(resultSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      playRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, Math.max(10, 1000 - speed));
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(playRef.current);
  }, [isPlaying, currentStepIndex, speed, steps]);

  const handlePauseResume = () => {
    if (currentStepIndex >= steps.length - 1 && !isPlaying) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const currentStep = steps[currentStepIndex] || null;

  return (
    <div className="app-container">
      <div className="toolbar">
        <div className="toolbar-group">
          <label>Algorithm</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            {Object.keys(ALGORITHMS).map(alg => (
              <option key={alg} value={alg}>{alg}</option>
            ))}
          </select>
        </div>
        <div className="toolbar-group">
          <label>Needle</label>
          <input type="text" value={needle} onChange={(e) => setNeedle(e.target.value)} />
        </div>
        <div className="toolbar-group">
          <label>Haystack</label>
          <input type="text" value={haystack} onChange={(e) => setHaystack(e.target.value)} style={{width: '300px'}} />
        </div>
        <div className="toolbar-group speed-group">
          <label>Iteration Speed</label>
          <input type="range" min="0" max="990" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </div>
        <button className="primary-btn" onClick={startSearch}>Search</button>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <h3>Code Snippet</h3>
          <pre><code>{ALGORITHM_CODE[algorithm]}</code></pre>
        </div>
        <div className="right-panel">
          <div className="stats-card">
            <h2 style={{textAlign: 'center'}}>{algorithm}</h2>
            <div className="stats-row" style={{justifyContent: 'center'}}>
              <div className="stat">
                <span className="value">occurrences = {currentStep ? currentStep.occurrences : 0}</span>
              </div>
              <div className="stat">
                <span className="value">time = {searchTime !== null ? `${searchTime} ms` : '0.000 ms'}</span>
              </div>
            </div>
            {steps.length > 0 && (
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}></div>
                <div className="progress-text">{currentStepIndex + 1} / {steps.length}</div>
              </div>
            )}
            <div className="controls" style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
              <button onClick={handlePauseResume} disabled={steps.length === 0}>
                {isPlaying ? 'Pause' : (currentStepIndex >= steps.length - 1 ? 'Restart' : 'Play')}
              </button>
            </div>
          </div>

          <div className="visualization-card">
            {currentStep?.hashInfo && <div className="hash-info">{currentStep.hashInfo}</div>}
            
            <div className="string-view haystack">
              {haystack.split('').map((char, idx) => {
                let className = "char";
                if (currentStep) {
                  const shift = currentStep.shift;
                  const cIdx = currentStep.compareIndex;
                  if (cIdx !== -1 && idx === shift + cIdx) {
                    if (currentStep.status === 'match') className += " match";
                    else if (currentStep.status === 'mismatch') className += " mismatch";
                    else if (currentStep.status === 'comparing') className += " comparing";
                  } else if (currentStep.status === 'found' && idx >= shift && idx < shift + needle.length) {
                    className += " found";
                  }
                }
                return <span key={idx} className={className}>{char === ' ' ? '\u00A0' : char}</span>;
              })}
            </div>

            <div className="string-view needle" style={{ transform: `translateX(${currentStep ? currentStep.shift * 30 : 0}px)` }}>
              {needle.split('').map((char, idx) => {
                let className = "char";
                if (currentStep) {
                  const cIdx = currentStep.compareIndex;
                  if (cIdx !== -1 && idx === cIdx) {
                    if (currentStep.status === 'match') className += " match";
                    else if (currentStep.status === 'mismatch') className += " mismatch";
                    else if (currentStep.status === 'comparing') className += " comparing";
                  } else if (currentStep.status === 'found') {
                    className += " found";
                  }
                }
                return <span key={idx} className={className}>{char === ' ' ? '\u00A0' : char}</span>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
