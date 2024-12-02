import { useEffect } from "react";

const ContactPage = () => {

  useEffect(() => {
    document.title = 'Contact us - Starex Hub';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-xl font-semibold">Contacts Page is under Construction.</p>
        <p className="text-base-content/60 text-base">Thank you for your patience</p>
      </div>
    </div>
  )
}

export default ContactPage