import { useEffect } from "react";
import BgImage from "../../public/BgImage.png";
import { Link } from "react-router-dom";
import PauseOnHover from "../components/PauseonHover";

const HomePage = () => {
  useEffect(() => {
    document.title = "Starex HUB";
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-primary/10 overflow-hidden">
      <div className="relative z-10 text-center items-center justify-center mt-16 py-5">
        <img className="mx-auto rounded-lg" alt="university" src={BgImage} />
        <section className="text-base md:mt-20 mt-6 mb-16 md:p-1 items-center justify-center">
          <div className="md:max-w-[80%] max-w-[95%] mx-auto md:p-10">
            <div className="text-center">
              <div className="md:text-4xl text-2xl font-semibold md:max-w-[90%] max-w-[95%] mx-auto italic">
                An initiative by Starex University, empowering innovation & fostering excellence — <span className="font-bold text-primary">Welcome to Starex HUB</span>
              </div>
            </div>

            <div className="md:flex max-w-[95%] mx-auto md:mt-16 mt-8 gap-10 items-center justify-center">
              <h3 className="md:text-start md:text-[16px] text-[14px] md:mb-0 mb-6 md:p-0 p-2">Starex Hub is a real-time chat application designed to facilitate instant communication and seamless collaboration among both faculty and students. With its user-friendly interface and robust features, it enables users to connect effortlessly, share ideas, and engage in meaningful discussions. Whether for academic collaborations, group projects, faculty-student interactions, or casual conversations, Starex Hub provides a secure and dynamic space for effective real-time communication, fostering a vibrant and connected educational community.</h3>
              <Link to="/signup">
                <button className="bg-primary/10 md:text-xl text-primary px-10 py-3 items-center justify-center rounded-lg hover:bg-primary/20 md:font-bold font-semibold md:w-52 border border-transparent hover:border-primary">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
          <hr className="max-w-[85%] mx-auto border border-primary/20 m-[50px]"/>
          <div className="md:max-w-[80%] mx-auto md:p-10">
            <div className="text-center">
              <div className="md:text-4xl text-2xl font-semibold md:max-w-[100%] max-w-[80%] mx-auto italic mb-10">
                Dedicated experts who inspire and guide students toward success through education, mentorship, and research — <span className="font-bold text-primary">Meet Our Faculty.</span>
              </div>
            </div>
            <PauseOnHover />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;


