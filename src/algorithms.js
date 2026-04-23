export function naiveSearch(haystack, needle) {
  const states = [];
  let comparisons = 0;
  let occurrences = 0;

  if (needle.length === 0 || haystack.length < needle.length) return states;

  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let j = 0;
    while (j < needle.length) {
      comparisons++;
      const isMatch = haystack[i + j] === needle[j];
      
      states.push({
        shift: i,
        compareIndex: j,
        status: isMatch ? 'match' : 'mismatch',
        comparisonsCount: comparisons,
        occurrences: occurrences
      });

      if (!isMatch) break;
      j++;
    }

    if (j === needle.length) {
      occurrences++;
      states.push({
        shift: i,
        compareIndex: j - 1,
        status: 'found',
        comparisonsCount: comparisons,
        occurrences: occurrences
      });
    }
  }

  states.push({
    shift: haystack.length,
    compareIndex: -1,
    status: 'done',
    comparisonsCount: comparisons,
    occurrences: occurrences
  });

  return states;
}

export function kmpSearch(haystack, needle) {
  const states = [];
  let comparisons = 0;
  let occurrences = 0;

  if (needle.length === 0 || haystack.length < needle.length) return states;

  const lps = new Array(needle.length).fill(0);
  let len = 0;
  let i = 1;
  while (i < needle.length) {
    if (needle[i] === needle[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  i = 0;
  let j = 0;
  while (i < haystack.length) {
    comparisons++;
    const isMatch = haystack[i] === needle[j];
    
    states.push({
      shift: i - j,
      compareIndex: j,
      status: isMatch ? 'match' : 'mismatch',
      comparisonsCount: comparisons,
      occurrences: occurrences
    });

    if (isMatch) {
      i++;
      j++;
    }

    if (j === needle.length) {
      occurrences++;
      states.push({
        shift: i - j,
        compareIndex: j - 1,
        status: 'found',
        comparisonsCount: comparisons,
        occurrences: occurrences
      });
      j = lps[j - 1];
    } else if (i < haystack.length && haystack[i] !== needle[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  states.push({
    shift: haystack.length,
    compareIndex: -1,
    status: 'done',
    comparisonsCount: comparisons,
    occurrences: occurrences
  });

  return states;
}

export function boyerMooreSearch(haystack, needle) {
  const states = [];
  let comparisons = 0;
  let occurrences = 0;

  if (needle.length === 0 || haystack.length < needle.length) return states;

  const badChar = new Map();
  for (let i = 0; i < needle.length; i++) {
    badChar.set(needle[i], i);
  }

  let s = 0;
  while (s <= haystack.length - needle.length) {
    let j = needle.length - 1;

    while (j >= 0) {
      comparisons++;
      const isMatch = needle[j] === haystack[s + j];
      
      states.push({
        shift: s,
        compareIndex: j,
        status: isMatch ? 'match' : 'mismatch',
        comparisonsCount: comparisons,
        occurrences: occurrences
      });

      if (!isMatch) break;
      j--;
    }

    if (j < 0) {
      occurrences++;
      states.push({
        shift: s,
        compareIndex: 0,
        status: 'found',
        comparisonsCount: comparisons,
        occurrences: occurrences
      });
      s += (s + needle.length < haystack.length) ? needle.length - (badChar.get(haystack[s + needle.length]) ?? -1) : 1;
    } else {
      const bcIndex = badChar.get(haystack[s + j]) ?? -1;
      s += Math.max(1, j - bcIndex);
    }
  }

  states.push({
    shift: haystack.length,
    compareIndex: -1,
    status: 'done',
    comparisonsCount: comparisons,
    occurrences: occurrences
  });

  return states;
}

export function rabinKarpSearch(haystack, needle) {
  const states = [];
  let comparisons = 0;
  let occurrences = 0;
  
  if (needle.length === 0 || haystack.length < needle.length) return states;

  const d = 256;
  const q = 101;
  let M = needle.length;
  let N = haystack.length;
  let i, j;
  let p = 0;
  let t = 0;
  let h = 1;

  for (i = 0; i < M - 1; i++) {
    h = (h * d) % q;
  }

  for (i = 0; i < M; i++) {
    p = (d * p + needle.charCodeAt(i)) % q;
    t = (d * t + haystack.charCodeAt(i)) % q;
  }

  for (i = 0; i <= N - M; i++) {
    let hashInfo = `Hash: pattern(${p}) vs text(${t})`;
    states.push({
      shift: i,
      compareIndex: -1,
      status: 'comparing',
      comparisonsCount: comparisons,
      occurrences: occurrences,
      hashInfo: hashInfo
    });

    if (p === t) {
      for (j = 0; j < M; j++) {
        comparisons++;
        const isMatch = haystack[i + j] === needle[j];
        states.push({
          shift: i,
          compareIndex: j,
          status: isMatch ? 'match' : 'mismatch',
          comparisonsCount: comparisons,
          occurrences: occurrences,
          hashInfo: hashInfo
        });
        if (!isMatch) break;
      }
      if (j === M) {
        occurrences++;
        states.push({
          shift: i,
          compareIndex: j - 1,
          status: 'found',
          comparisonsCount: comparisons,
          occurrences: occurrences,
          hashInfo: hashInfo
        });
      }
    }

    if (i < N - M) {
      t = (d * (t - haystack.charCodeAt(i) * h) + haystack.charCodeAt(i + M)) % q;
      if (t < 0) t = t + q;
    }
  }

  states.push({
    shift: N,
    compareIndex: -1,
    status: 'done',
    comparisonsCount: comparisons,
    occurrences: occurrences
  });

  return states;
}
