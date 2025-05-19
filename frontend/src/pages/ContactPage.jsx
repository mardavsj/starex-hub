import { useEffect } from "react";

const ContactPage = () => {

  useEffect(() => {
    document.title = 'Contact us - StarX';
  }, []);

  return (
    <div className="py-32 md:px-0 px-4 mx-auto bg-primary/10 ">
      <div className="container mx-auto px-6 md:max-w-[60%]">
        <section className="text-center mb-16">
          <h2 className="md:text-4xl text-2xl font-bold text-primary md:mb-8 mb-4">Contact Us</h2>
          <p className="md:text-md text-sm mx-auto">
            Have questions, suggestions, or feedback? We would love to hear from you! Reach out to us using the contact details below, and we&apos;ll get back to you as soon as possible.
          </p>
        </section>

        <section className="text-center md:mb-28 mb-20">
          <h2 className="md:text-3xl text-2xl font-bold text-primary md:mb-8 mb-4">Our Contact Details</h2>
          <div className="md:text-md text-sm mb-4">
            <p className="font-semibold">Email: <span className="font-light">mardavjadaun113@gmail.com</span></p>
            <p className="font-semibold">Phone: <span className="font-light"> | +91 9503501043 | </span></p>
            <p className="font-semibold">Address: <span className="font-light">NH 48, Vill. Binola, P.O. Bhorakalan, Gurugram, Haryana - 122413</span></p>
          </div>
        </section>

        <section className="">
          <h2 className="md:text-3xl text-2xl font-bold text-primary text-center md:mb-8 mb-4">Find Us Here</h2>
          <div className="flex justify-center">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1756.5101235214813!2d76.86285371744384!3d28.297710800000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d165555555555%3A0x13bc99cc990a2f63!2sStarex%20University%20Gurugram!5e0!3m2!1sen!2sin!4v1736247744826!5m2!1sen!2sin" width="900" height="450" style={{border:0}} allowfullscreen="" loading="lazy"></iframe>

          </div>
        </section>
      </div>
    </div>
  )
}

export default ContactPage