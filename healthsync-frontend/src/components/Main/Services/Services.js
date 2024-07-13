import { ServicesData } from "../../../components/Shared/Consts";
import Button from "../../../components/UI/Button";
import Service from "./Service";
import { useState } from "react";
import { SelectedService } from "../../../components/Shared/Types";
import ListItem from "./ListItem";
import Banner1 from "./Banner1";
import SectionWrapper from "../SectionWrapper";

const Services = () => {
  const [SelectService, setSelectService] = useState(
    SelectedService.Cardiology
  );

  const selectedServiceData = ServicesData.find(
    (service) => service.id === SelectService
  );
  return (
    <SectionWrapper id="services">
      <h2 className="text-4xl font-bold text-center mb-10">Our Features</h2>

      <div className="grid grid-cols-3 gap-5">
        {ServicesData?.map((service, index) => (
          <Service
            key={index}
            service={service}
            SelectService={SelectService}
            setSelectService={setSelectService}
          />
        ))}
      </div>
      <Banner1 />
    </SectionWrapper>
  );
};

export default Services;
