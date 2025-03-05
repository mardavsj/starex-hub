import { useState } from "react";

const BgAnimation = () => {
    const squareSize = "130px";

    const [circles] = useState(() =>
        Array.from({ length: 16 }).map(() => ({
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 30 + 10}s`,
        }))
    );

    return (
        <ul className="absolute w-full h-full overflow-hidden z-0">
            {circles.map((circle, index) => (
                <li
                    key={index}
                    className="absolute -bottom-28 left-0 list-none bg-primary/15 animate-float"
                    style={{
                        left: circle.left,
                        width: squareSize,
                        height: squareSize,
                        animationDelay: circle.animationDelay,
                        animationDuration: circle.animationDuration,
                    }}
                />
            ))}
        </ul>
    );
};

export default BgAnimation;
