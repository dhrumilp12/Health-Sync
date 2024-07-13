import Button from '../../../components/UI/Button';
import hero from '../../../assets/Images/hero.png';
import DescNums from './DescNums';
import SectionWrapper from '../SectionWrapper';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <SectionWrapper id="home">
      <div className="flex flex-col-reverse  md:flex-row items-center justify-between gap-10 text-center md:text-left">
        <div className=" tracking-wider md:tracking-normal max-w-xs lg:max-w-xl ">
          <h1 className="lg:text-7xl text-4xl font-bold">
            Elder's Health Is Our Top Priority
          </h1>
          <p className="text-lg md:text-base lg:text-xl my-10">
          Securely share comprehensive health data, request assistance, and monitor health metrics with ease. Our platform enhances communication and care, bridging the gap between elders, volunteers, doctors, and loved ones.
          </p>
          <Link to="/login"><Button>Try Now!</Button></Link>
        </div>
        <div className="max-w-xs md:max-w-none">
          <img src={hero} alt="hero" />
        </div>
      </div>
      <DescNums />
    </SectionWrapper>
  );
};

export default Home;
