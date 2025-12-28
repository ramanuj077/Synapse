// A simple, rule-based analyzer to detect obvious issues cheaply before hitting the AI.

class SmellAnalyzer {
    analyze(code, adapter) {
        const detected = [];
        const lowerCode = code.toLowerCase();

        // 1. Generic Heuristics
        if (code.split('\n').length > 50) {
            detected.push("Function/File potentially too long");
        }

        // 2. Language Specific Heuristics (Basic regex checks)

        // JS/React
        if (adapter.name === 'JavaScript' || adapter.name === 'React') {
            if (/\bvar\b/.test(code)) detected.push("Legacy 'var' usage detected");
            if (/console\.log/.test(code)) detected.push("Debug console.log detected");
            if (/(for|if|while)\s*\(.*\)\s*\{\s*.*\s*(for|if|while)/.test(code.replace(/\n/g, ''))) detected.push("Deep nesting detected");
        }

        // React Specific
        if (adapter.name === 'React') {
            if (/useEffect\(\(\)\s*=>\s*\{.*\}\)/s.test(code)) { // Rough check for missing dependency array
                // heuristic: useEffect without comma before closing paren
                detected.push("Possible missing dependency array in useEffect");
            }
        }

        // Python
        if (adapter.name === 'Python') {
            if (/except:/.test(code)) detected.push("Bare except clause detected (Pokemon exception handling)");
            if (/print\(/.test(code)) detected.push("Print statement detected");
        }

        // Java
        if (adapter.name === 'Java') {
            if (/System\.out\.print/.test(code)) detected.push("System.out.print usage");
            if (/catch\s*\(\w+\s+\w+\)\s*\{\s*\}/.test(code)) detected.push("Empty catch block detected");
        }

        return detected;
    }
}

module.exports = new SmellAnalyzer();
