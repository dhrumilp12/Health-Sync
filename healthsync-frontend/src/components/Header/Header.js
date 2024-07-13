import Logo from "../../assets/Images/Logo.png";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import { SelectedPage } from "../../components/Shared/Types";
import { Link } from "react-router-dom";

const Header = () => {
  const [selectedPage, setSelectedPage] = useState(SelectedPage.Home);
  const [isTopOfPage, setIsTopOfPage] = useState(true);
  const flexBetween = "flex items-center justify-between";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`${flexBetween} ${
        isTopOfPage ? "" : "bg-[#84ceff]"
      } transition fixed top-0 z-30 w-full p-5 md:px-16`}
    >
      <Link to="/">
        <img className="w-8 sm:w-16 rounded-md" src={Logo} alt="Logo" />
      </Link>
      <NavBar
        flexBetween={flexBetween}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
    </div>
  );
};

export default Header;
