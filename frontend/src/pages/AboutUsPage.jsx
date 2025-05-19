import { useEffect } from "react";
import Aditya from "../../public/aditya.jpg"
import Mardav from "../../public/mardav.jpg"
import Vikash from "../../public/vikash.jpg"

const AboutUsPage = () => {

  useEffect(() => {
    document.title = 'About us - StarX ';
  }, []);

  return (
    <div className="py-28 mx-auto md:px-20 px-8 bg-primary/10">
      <div className="container mx-auto md:px-6">
        <section className="text-center mb-16 md:max-w-[75%] mx-auto">
          <h2 className="md:text-4xl text-2xl font-bold text-primary mb-4">About StarX</h2>
          <p className="md:text-md text-sm mx-auto">
            StareX is a next-generation chat platform designed exclusively for students to connect, collaborate, and thrive. Our mission is to create a safe, engaging, and resourceful space where students can learn, grow, and communicate with each other in a secure environment. Whether you are preparing for exams, working on group projects, or simply looking to share ideas, StarX is here to support you every step of the way.
          </p>
        </section>

        <section className="md:mb-28 mb-20 grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2 md:max-w-[75%] mx-auto">
          <div className="bg-primary/15 p-8 rounded-lg">
            <h3 className="md:text-2xl text-xl font-bold text-primary mb-4">Our Mission</h3>
            <p className="md:text-md text-sm mx-auto">
              Our mission is to foster a collaborative environment where students can easily communicate, share knowledge, and support one another in their educational journeys. StarX is designed to simplify learning, encourage community engagement, and provide tools that enhance productivity and learning outcomes.
            </p>
          </div>
          <div className="bg-primary/15 p-8 rounded-lg">
            <h3 className="md:text-2xl text-xl font-bold text-primary mb-4">Our Vision</h3>
            <p className="md:text-md text-sm mx-auto">
              We envision a world where students are empowered through technology, making education more accessible, inclusive, and enjoyable. StarX aims to be the go-to platform for student collaboration, enabling users to grow their knowledge, build networks, and achieve their academic goals.
            </p>
          </div>
        </section>

        <hr className="mx-auto border border-primary/20 m-[50px] " />

        <section className="text-center md:mb-28 mb-20 md:max-w-[75%] mx-auto">
          <h2 className="md:text-3xl text-2xl font-bold text-primary mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-2">
            <div className="bg-primary/15 p-8 rounded-lg">
              <h4 className="text-xl font-semibold text-primary mb-4">Collaboration</h4>
              <p className="md:text-md text-sm">We believe in the power of teamwork, where every student&apos;s voice is heard and valued. Collaboration drives learning and sparks creativity.</p>
            </div>
            <div className="bg-primary/15 p-8 rounded-lg">
              <h4 className="text-xl font-semibold text-primary mb-4">Security</h4>
              <p className="md:text-md text-sm">Your safety and privacy are our top priority. We take great care to ensure that your interactions within the platform are secure and respectful.</p>
            </div>
            <div className="bg-primary/15 p-8 rounded-lg">
              <h4 className="text-xl font-semibold text-primary mb-4">Innovation</h4>
              <p className="md:text-md text-sm">We strive to create innovative solutions that make learning more interactive, efficient, and enjoyable. We are always evolving to meet the needs of students.</p>
            </div>
          </div>
        </section>

        <hr className="mx-auto border border-primary/20 m-[50px] " />

        <section className="text-center md:max-w-[75%] mx-auto">
          <h2 className="md:text-3xl text-2xl font-bold text-primary md:mb-8 mb-0">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-2">
            <div className="bg-primary/15 p-6 rounded-lg scale-95 hover:scale-100 transition-transform ease-in-out duration-300">
              <img src={Vikash} alt="Team Member 1" className="w-32 h-32 mx-auto rounded-full mb-4" />
              <h4 className="text-xl font-semibold text-primary">Vikash Kumar</h4>
              <p className="text-md">Co-Founder</p>
            </div>
            <div className="bg-primary/15 p-6 rounded-lg scale-105 hover:scale-110 transition-transform ease-in-out duration-300">
              <img src={Mardav} alt="Team Member 2" className="w-32 h-32 mx-auto rounded-full mb-4" />
              <h4 className="text-xl font-semibold text-primary">Mardav Jadaun</h4>
              <p className="text-md">Founder & CEO</p>
            </div>
            <div className="bg-primary/15 p-6 rounded-lg scale-95 hover:scale-100 transition-transform ease-in-out duration-300">
              <img src={Aditya} alt="Team Member 3" className="w-32 h-32 mx-auto rounded-full mb-4" />
              <h4 className="text-xl font-semibold text-primary">Aditya Ola</h4>
              <p className="text-md">Product Manager</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutUsPage