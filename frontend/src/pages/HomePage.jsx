import { useEffect } from "react";

const HomePage = () => {

  useEffect(() => {
    document.title = 'Starex Hub';
  }, []);

  return (
      <div className="p-72 text-center text-xl">
        HomePage is under Construction.
        <p className="text-base-content/60 text-base">Thank you for your patience</p>
      </div>
  )
}

export default HomePage