import { links } from "../../components/Shared/Consts";
import Link from "./Link";

const Links = ({ selectedPage, setSelectedPage }) => {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link}
          page={link}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      ))}
    </>
  );
};

export default Links;
