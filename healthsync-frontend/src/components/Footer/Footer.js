import { FooterData } from "../Shared/Consts";
import SocialsDiv from "../Socials/SocialsDiv";
import Input from "../UI/Input";

const Footer = () => {
  return (
    <footer className="bg-[#aed4ff] mt-20 p-10 md:px-16">
      <div className="max-w-[1250px] m-auto flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start gap-14">
        <div className="font-bold text-center md:text-left flex-shrink-0">
          <img width={50} src={FooterData.logo} alt="Footer Logo" className="mx-auto md:mx-0 rounded-md" />
          {FooterData.addresses.map((address, index) => (
            <p className="my-3" key={index}>
              {address}
            </p>
          ))}
          <p>{FooterData.phone}</p>
        </div>
        <div className="w-full md:w-auto text-center md:text-left flex justify-center md:justify-start">
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <SocialsDiv />
          </div>
        </div>
        <div className="w-full md:w-auto text-center md:text-left">
          <h4 className="font-semibold mb-4">Subscribe to our newsletter</h4>
          <Input placeholder="Enter your email" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
