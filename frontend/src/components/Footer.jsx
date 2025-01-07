import { Link } from "react-router-dom";
import { IoLogoYoutube } from "react-icons/io";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

const Footer = () => {

    const openERPPortal = () => {
        window.open('https://erp.starexuniversity.in/index.php', '_blank');
    };

  return (
      <footer className="footer footer-center bg-base-200 text-base-content rounded p-10 mt-10">
          <nav className="md:grid md:grid-flow-col gap-4 font-semibold">
              <Link to="/" className="link link-hover text-primary">Home</Link>
              <Link to="/about" className="link link-hover">About us</Link>
              <Link to="/contact" className="link link-hover">Contact</Link>
              <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
              <Link to="#" onClick={openERPPortal} className="link link-hover">
                  ERP Portal
              </Link>
          </nav>
          <nav>
              <div className="grid grid-flow-col gap-4 text-primary items-center justify-center">
                  <Link to="https://www.youtube.com/@starexuniversity1187" target="_blank" className="cursor-pointer hover:scale-110 ease-in-out">
                      <IoLogoYoutube size={30}/>
                  </Link>
                  <Link to="https://www.facebook.com/Starexuniversity/" target="_blank" className="cursor-pointer hover:scale-110 ease-in-out">
                      <FaFacebookF size={30} />
                  </Link>
                  <Link to="https://www.instagram.com/starexuniversity/" target="_blank" className="cursor-pointer hover:scale-110 ease-in-out">
                      <FaInstagram size={30}/>
                  </Link>
                  <Link to="https://www.linkedin.com/school/starexuniversity/" target="_blank" className="cursor-pointer hover:scale-110 ease-in-out">
                      <FaLinkedinIn size={30} />
                  </Link>
              </div>
          </nav>
          <aside>
              <p className="text-base-content/60">
                <span className="font-semibold">Starex Hub | </span>Copyright © {new Date().getFullYear()} - All right reserved by Starex University
              </p>
          </aside>
      </footer>
  )
}

export default Footer