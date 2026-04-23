# String Matching Algorithm Comparator and Visualizer

This project is a React-based web application that visually compares and demonstrates the execution of various string matching algorithms. It allows users to input a custom "haystack" (text) and "needle" (pattern), select an algorithm, adjust the iteration speed, and watch the matching process step-by-step.

## Methodologies

The application implements four classic string matching algorithms. The Deterministic Finite Automata (DFA) approach was intentionally excluded per project requirements.

### 1. Naive String Matching
The Naive algorithm uses a straightforward approach, sliding the pattern over the text one character at a time. For every alignment, it checks for a match character by character. If a mismatch occurs, the pattern is shifted exactly one position to the right. While simple to implement, its worst-case time complexity is $O(M \times (N-M+1))$ where $M$ is the length of the pattern and $N$ is the length of the text.

### 2. Knuth-Morris-Pratt (KMP)
The KMP algorithm improves upon the naive approach by avoiding redundant comparisons. It preprocesses the pattern to create an LPS (Longest Proper Prefix which is also Suffix) array. During the search phase, when a mismatch occurs, the LPS array dictates how much the pattern can be shifted safely without missing any potential matches, effectively keeping the search linear. The time complexity is $O(N + M)$.

### 3. Boyer-Moore (Simplified Bad Character Heuristic)
The Boyer-Moore algorithm compares characters from right to left (starting from the end of the pattern). For visualization purposes, this project implements the simplified version relying on the **Bad Character Heuristic**. It preprocesses the pattern to map the last occurrence of each character. When a mismatch occurs, it shifts the pattern so that the mismatched character in the text aligns with its last occurrence in the pattern. This heuristic makes it extremely fast in practice, especially for larger alphabets.

### 4. Rabin-Karp
The Rabin-Karp algorithm uses a rolling hash function to quickly filter out positions where the pattern cannot match. It calculates a hash value for the pattern and for a sliding window of the text. If the hash values match, it performs a character-by-character comparison to confirm the match (handling potential hash collisions). The rolling hash allows the window's hash to be updated in $O(1)$ time, yielding an average time complexity of $O(N + M)$, though the worst-case remains $O(N \times M)$ if many collisions occur.

---

## Code Summary

### Tech Stack
- **Framework**: React 18 (Bootstrapped with Vite)
- **Styling**: Vanilla CSS (Tailwind and external UI libraries were omitted to maintain a bespoke, clean, and flat "human-made" aesthetic, explicitly avoiding glassmorphism or purple gradients).

### Architecture Highlights
The application is structured into clearly separated domains:

1. **Algorithm Implementations (`src/algorithms.js`)**: 
   Instead of simply returning the number of occurrences, each algorithm acts as a state generator. It returns an array of "steps". Each step is an object capturing the state of the algorithm at a specific iteration:
   ```javascript
   {
     shift: number,           // Current alignment of pattern relative to haystack
     compareIndex: number,    // Current character index being compared
     status: 'comparing' | 'match' | 'mismatch' | 'found' | 'done',
     comparisonsCount: number,// Total comparisons up to this point
     occurrences: number,     // Total matches found up to this point
     hashInfo?: string        // (Rabin-Karp only) Current hash values
   }
   ```
   This abstraction cleanly separates the algorithm logic from the visualization logic.

2. **State Management & Playback (`src/App.jsx`)**:
   The main `App` component acts as the orchestrator. When the user clicks "Search", it invokes the selected algorithm to generate the entire array of steps. It then uses a `useEffect` loop governed by a `setTimeout` (controlled by the user's "Iteration Speed" slider) to increment a `currentStepIndex`.

3. **Visualizer Component (`src/App.jsx`)**:
   The right pane renders the `haystack` and `needle`. The `needle` is translated horizontally using CSS `transform: translateX(...)` based on the `shift` value of the current step. Individual characters dynamically receive CSS classes (`match`, `mismatch`, `comparing`, `found`) depending on the `status` and `compareIndex` of the current step, which are styled using predefined tokens in `App.css`.

---

## Steps for Running the Application

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher is recommended)
- `npm` (comes bundled with Node.js)

### Installation & Execution

1. **Open your terminal/command prompt**.
2. **Navigate to the project directory** (where this `documentation.md` and `package.json` are located):
   ```bash
   cd path/to/DAA_project
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser**: 
   Look at the terminal output for the local server URL. Usually, it will be `http://localhost:5173/` or `http://localhost:5174/`. Open that link in your web browser.

### Usage
1. Use the **Algorithm** dropdown in the top toolbar to select the string matching algorithm you wish to visualize.
2. Edit the **Needle** (pattern) and **Haystack** (text) inputs as desired.
3. Adjust the **Iteration Speed** slider. Moving it to the right makes the visualization step through faster.
4. Click **Search**. The visualizer will begin animating the algorithm step-by-step.
5. Use the **Pause/Play** button inside the right panel to halt or resume the visualization at any time. When finished, you can click **Restart** to play it again.
