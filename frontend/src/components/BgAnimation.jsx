import { useState } from "react";

const BgAnimation = () => {
    const [circles] = useState(() =>
        Array.from({ length: 15 }).map(() => ({
            left: `${Math.random() * 90}%`,
            width: `${Math.random() * 100 + 20}px`,
            height: `${Math.random() * 100 + 50}px`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 30 + 10}s`,
        }))
    );

    return (
        <ul className="absolute w-full h-full overflow-hidden z-0">
            {circles.map((circle, index) => (
                <li
                    key={index}
                    className="absolute -bottom-28 left-0 list-none bg-primary/20 animate-float"
                    style={{
                        left: circle.left,
                        width: circle.width,
                        height: circle.height,
                        animationDelay: circle.animationDelay,
                        animationDuration: circle.animationDuration,
                    }}
                />
            ))}
        </ul>
    );
};

export default BgAnimation;
