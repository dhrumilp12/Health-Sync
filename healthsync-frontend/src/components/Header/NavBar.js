import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import useMediaQuery from "../../Hooks/useMediaQuery";
import { AuthContext } from "../../context/AuthContext";
import Button from "../UI/Button";
import Links from "./Links";

const NavBar = ({ flexBetween, selectedPage, setSelectedPage }) => {
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
  };

  return (
    <nav>
      {isAboveMediumScreens && (
        <div className={`${flexBetween} lg:gap-28 gap-20`}>
          <div className={`${flexBetween} gap-16`}>
            <Links
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </div>
          <Link to="/health-input">
              <Button>Health Input</Button>
            </Link>
            <Link to="/health-visualization">
              <Button>Health Visualization</Button>
            </Link>
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen((prev) => !prev)}>
                <img
                  src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png" // Replace with actual avatar source
                  alt="User Avatar"
                  className="rounded-full w-8 h-8"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
          )}
        </div>
      )}
      {!isAboveMediumScreens && (
        <button onClick={() => setIsMenuToggled((prev) => !prev)}>
          <Bars3Icon className="h-8 w-8" />
        </button>
      )}
      {/* MOBILE MENU MODAL */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 top-0 z-40 h-80 rounded-es-3xl w-[175px] md:w-[300px] bg-secondary drop-shadow-2xl">
          {/* CLOSE ICON */}
          <div className="flex justify-end p-5 md:pr-16 sm:pt-10">
            <button onClick={() => setIsMenuToggled((prev) => !prev)}>
              <XMarkIcon className="h-10 w-10" />
            </button>
          </div>

          {/* MENU ITEMS */}
          <div className="ml-[20%] flex flex-col items-start gap-5 text-2xl">
            <Links
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
