const AuthImagePattern = ({ title, subtitle }) => {

    const logoSquares = [4];

    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
            <div className="max-w-md text-center">
                <p className="text-base-content/60 p-4">
                    <span className="font-semibold">Connecting Lives:</span> An Initiative by Starex University
                </p>
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-2xl overflow-hidden ${logoSquares.includes(i) ? "" : "bg-primary/50 " + (i % 2 === 0 ? "animate-pulse" : "")
                                }`}
                        >
                            {logoSquares.includes(i) ? (
                                <img
                                    src="/su_logo.jpg"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            ) : null}
                        </div>
                    ))}
                </div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-base-content/60">{subtitle}</p>
            </div>
        </div>
    );
};

export default AuthImagePattern;