const code = "function test() { var x = 1; }";
const payload = {
    code: code,
    preferences: {},
    refactorType: "clean-code"
};

fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
    .then(res => res.text())
    .then(text => {
        console.log('RESPONSE:', text.substring(0, 500));
    })
    .catch(err => console.error('ERROR:', err));
