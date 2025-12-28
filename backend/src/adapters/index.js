// Adapters define the "Personality" of the refactoring engine for each language.

const javascriptAdapter = {
    name: "JavaScript",
    extensions: ['.js', '.mjs', '.cjs'],
    styleGuide: "Modern ES6+, async/await, arrow functions where appropriate, prefer const/let over var.",
    smells: [
        "Var usage (prefer let/const)",
        "Callback hell (prefer async/await)",
        "Long functions (> 20 lines)",
        "Deep nesting (> 3 levels)",
        "Console logs left in production code",
        "Magic numbers",
        "Inefficient loops"
    ],
    constraints: [
        "Do NOT change external function signatures (exports).",
        "Do NOT remove comments that explain business logic.",
        "Ensure strict equality (===) usage."
    ]
};

const reactAdapter = {
    name: "React",
    extensions: ['.jsx', '.tsx'],
    styleGuide: "Functional Components, Hooks (useEffect, useState), strictly no Class Components.",
    smells: [
        "Direct DOM manipulation",
        "Missing dependency arrays in useEffect",
        "Prop drilling",
        "Inline heavy computations",
        "Unused props/state"
    ],
    constraints: [
        "Preserve component structure.",
        "Ensure React is imported if needed (though modern React doesn't always need it).",
        "Keep Hooks at the top level."
    ]
};

const pythonAdapter = {
    name: "Python",
    extensions: ['.py'],
    styleGuide: "PEP 8 compliant, type hinting (Python 3.5+), vectorized operations where possible.",
    smells: [
        "Mutable default arguments",
        "Wildcard imports (from module import *)",
        "Bare except clauses",
        "Complex list comprehensions",
        "Global variables"
    ],
    constraints: [
        "Respect whitespace/indentation perfectly.",
        "Use docstrings for functions."
    ]
};

const javaAdapter = {
    name: "Java",
    extensions: ['.java'],
    styleGuide: "Google Java Style, dependency injection, Streams API where appropriate.",
    smells: [
        "Public fields (encapsulation violation)",
        "God classes",
        "Empty catch blocks",
        "Null checks everywhere (prefer Optional)"
    ],
    constraints: [
        "Keep class structure intact.",
        "Use proper camelCase for methods."
    ]
};

module.exports = {
    getAdapter: (languageOrFilename) => {
        const input = languageOrFilename.toLowerCase();

        // Match by Name
        if (input.includes('javascript') || input.includes('js')) return javascriptAdapter;
        if (input.includes('react') || input.includes('jsx')) return reactAdapter;
        if (input.includes('python') || input.includes('py')) return pythonAdapter;
        if (input.includes('java')) return javaAdapter;

        // Match by Extension
        if (input.endsWith('.js')) return javascriptAdapter;
        if (input.endsWith('.jsx')) return reactAdapter;
        if (input.endsWith('.py')) return pythonAdapter;
        if (input.endsWith('.java')) return javaAdapter;

        // Default to JS if unknown, or generic
        return javascriptAdapter;
    }
};
