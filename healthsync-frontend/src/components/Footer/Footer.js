import { FooterData } from "../Shared/Consts";
import SocialsDiv from "../Socials/SocialsDiv";
import Input from "../UI/Input";

const Footer = () => {
  return (
    <div className="bg-[#aed4ff] mt-20 p-10 md:px-16">
      <div className="max-w-[1250px] m-auto flex justify-center gap-14 flex-wrap md:flex-nowrap">
        <div className="font-bold">
          <img width={50} src={FooterData.logo} alt="Logo" />
          {FooterData.addresses.map((address, index) => (
            <p className="my-3" key={index}>
              {address}
            </p>
          ))}
          <p>{FooterData.phone}</p>
        </div>
        <div className="flex gap-10">
          <ul>
            {FooterData.links.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
        <div className="max-w-xs">
          <p className="ml-1 font-bold max-w-[250px]">
            Have Something To Talk About With Our Professionals?
          </p>
          <Input placeholder="Your Email" />
          <SocialsDiv />
        </div>
      </div>
    </div>
  );
};

export default Footer;
