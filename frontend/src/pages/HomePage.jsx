import { useEffect } from "react";

const HomePage = () => {

  useEffect(() => {
    document.title = 'Starex HUB - Home';
  }, []);

  return (
    <div>
      HomePage
    </div>
  )
}

export default HomePage