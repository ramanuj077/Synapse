import { useEffect, useState } from 'react';

const AnimatedNumber = ({ value, duration = 1500, suffix = '', color = 'inherit', fontSize = '2rem' }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // Parse the value if it's a string (like "15%")
        const numericValue = typeof value === 'string'
            ? parseInt(value.replace(/[^0-9]/g, ''))
            : value;

        if (isNaN(numericValue)) {
            setDisplayValue(value);
            return;
        }

        let startTime = null;
        const startValue = 0;
        const endValue = numericValue;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (endValue - startValue) * easeOut);

            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <span style={{
            fontSize,
            color,
            fontWeight: 700,
            display: 'inline-block',
            fontVariantNumeric: 'tabular-nums'
        }}>
            {displayValue}{suffix}
        </span>
    );
};

export default AnimatedNumber;
