  import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
  import { SelectedPage } from "../../components/Shared/Types";
  import { useState } from "react";
  import { Link } from "react-router-dom";
  import useMediaQuery from "../../Hooks/useMediaQuery";

  import Links from "./Links";
  import Button from "../UI/Button";
  import Login from "../Login";

  const NavBar = ({ flexBetween, selectedPage, setSelectedPage }) => {
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

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
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
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
            <div className=" ml-[20%] flex flex-col items-start gap-5 text-2xl">
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
