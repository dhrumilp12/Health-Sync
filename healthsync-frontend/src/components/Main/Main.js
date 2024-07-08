import Home from '../../components/Main/Home/Home';
import Doctors from './Doctors/Doctors';
import Services from './Services/Services';

const Main = () => {
  return (
    <div className="m-auto max-w-[1250px] px-5 md:px-16">
      <Home />
      <Services />
      <Doctors />
    </div>
  );
};

export default Main;
