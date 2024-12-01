import { useEffect } from "react";

const HomePage = () => {

  useEffect(() => {
    document.title = 'Starex Hub';
  }, []);

  return (
    <div>
      HomePage
    </div>
  )
}

export default HomePage