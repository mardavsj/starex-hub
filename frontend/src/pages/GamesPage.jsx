const games = [
  {
    id: 1,
    title: "Flappy Bird",
    description: "Flappy Bird is a fast-paced arcade game where you control a bird, trying to navigate through gaps in pipes. Tap to keep the bird flying and avoid crashing. Simple yet highly addictive",
    imageUrl: "https://wallpaperaccess.com/full/4622695.jpg",
    gameLink: "https://raktaa.itch.io/flapy-bird",
  },
  {
    id: 2,
    title: "Stack Game",
    description: "Stack is a minimalist puzzle game where you stack colorful blocks to build the tallest tower. The goal is to carefully place each block to avoid toppling the stack. Test your precision and timing!",
    imageUrl: "https://res.cloudinary.com/lmn/image/upload/e_sharpen:150,f_auto,fl_lossy,q_80/v1/gameskinnyc/s/t/a/stack-ee5b0.png",
    gameLink: "https://iluma-stack-game.vercel.app/",
  },
];

const GamesPage = () => {
  return (
    <div className="games-page mt-16 py-5 p-0 bg-primary/10">
      <h2 className="text-center text-3xl font-bold mb-8">Our Games</h2>
      <div className="flex flex-col gap-6 items-center">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card md:flex flex-row items-center sm:w-[65%] w-[75%] bg-primary/20 rounded-lg cursor-pointer border border-primary/40 hover:scale-105 ease-in-out transition"
            onClick={() => window.open(game.gameLink, "_blank")}
          >
            <img
              src={game.imageUrl}
              alt={game.title}
              className="sm:size-52 h-40 w-72 object-cover rounded-t-lg sm:rounded-l-lg"
            />
            <div className="p-4 flex-1">
              <h3 className="text-xl font-bold text-primary">{game.title}</h3>
              <p className="text-sm mt-2">{game.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
