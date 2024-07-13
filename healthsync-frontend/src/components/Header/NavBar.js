import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "../../Hooks/useMediaQuery";
import { AuthContext } from "../../context/AuthContext";
import Button from "../UI/Button";
import Links from "./Links";


const NavBar = ({ flexBetween, selectedPage, setSelectedPage }) => {
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAppointmentDropdownOpen, setAppointmentIsDropdownOpen] =
    useState(false);

    const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      navigate(selectedValue);
    }
  };

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
            <Link
              className={`${"text-primary mt-0.5 border-[#2b7dad]"} transition font-bold text-lg duration-500 hover:text-[#2b7dad]`}
              to="/chat"
            >
              Chat
            </Link>
            <Link
              className={`${"text-primary mt-0.5 border-[#2b7dad]"} transition font-bold text-lg duration-500 hover:text-[#2b7dad]`}
              to="/sos"
            >
              SOS
            </Link>
            <select
      className={`${"text-primary mt-0.5 border-[#2b7dad]"} transition font-bold text-lg duration-500 hover:text-[#2b7dad] bg-transparent`}
      onChange={handleSelectChange}
    >
      <option value="">Medication & Food</option>
      <option value="/medication-list">Medication List</option>
      <option value="/medication-form">Medication Form</option>
      <option value="/food">Food recommendation</option>
      <option value="/meals">Meals</option>
      <option value="/food-list">Food List</option>
    </select>
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
                  <Link
                    to="/volunteer-req"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Request Volunteer
                  </Link>
                  <div
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex"
                    onClick={() =>
                      setAppointmentIsDropdownOpen(!isAppointmentDropdownOpen)
                    }
                  >
                    Appointment
                    {!isAppointmentDropdownOpen ? (
                      <span className="ml-3">
                        <svg
                          fill="#949494"
                          height="20px"
                          width="20px"
                          version="1.1"
                          id="Layer_1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 330 300"
                          stroke="#949494"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              id="XMLID_225_"
                              d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                            ></path>{" "}
                          </g>
                        </svg>
                      </span>
                    ) : (
                      <span className="ml-3">
                      <svg
                        fill="#949494"
                        height="20px"
                        width="20px"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 330 330"
                        transform="rotate(180)"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            id="XMLID_225_"
                            d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                          ></path>{" "}
                        </g>
                      </svg>
                      </span>
                    )}
                  </div>

                  {isAppointmentDropdownOpen && (
                    <>
                      <Link
                        to="/schedule-appointment"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Schedule Appointment
                      </Link>
                      <Link
                        to="/appointment-list"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        View Appointment List
                      </Link>
                    </>
                  )}

                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Change Password
                  </Link>
                  <Link
                    to="/delete-account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Delete Account
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
      {!isAboveMediumScreens && !isMenuToggled && (
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
