import { useEffect } from "react";
import BgImage from "../../public/BgImage.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  useEffect(() => {
    document.title = "Starex HUB";
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-l overflow-hidden">
      <div className="relative z-10 text-center items-center justify-center mt-16 py-5">
        <img className="mx-auto brightness-90 rounded-lg " alt="university" src={BgImage} />
        <section className="text-base md:mt-20 mt-6 mb-5 md:p-1 p-5 items-center justify-center">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold text-primary">
              Welcome to Starex HUB
            </h1>
            <p className="text-sm">- An initiative by Starex University.</p>
          </div>
          <div className="mt-8 mb-16 md:w-3/5 mx-auto ">
            Starex Hub is a next-generation platform where students connect, collaborate, and thrive. Designed for seamless communication and learning, it empowers students to share ideas, exchange knowledge, and build lasting connections in a secure and vibrant community focused on growth and success.
          </div>
          <Link to="/signup" className="bg-primary/10 text-primary px-10 py-3 rounded-lg hover:bg-primary/20 font-bold">
            Get Started
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;


