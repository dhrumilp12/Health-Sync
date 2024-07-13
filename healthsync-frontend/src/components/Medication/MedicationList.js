import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../Header/Header";

const MedicationList = () => {
  const [medications, setMedications] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/get-medications")
      .then((res) => {
        setMedications(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (medicineName) => {
    const stripe = await loadStripe(
      "pk_test_51LCnRQSJSsOC2eKt1uhfUNxQU5bunGdtuP2dSRxFkoWYSLTuxCSTJVKMJZ0SiIajvoJb9JvgrMIF7VepheZ4Glhz00mbaU5Efs"
    );
    axios
      .post(
        "http://127.0.0.1:5000/api/create-checkout-session",
        { medicineName, amount: 1000 },
        {
          // Adjust amount accordingly
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          const sessionId = res.data.sessionId;
          const result = stripe.redirectToCheckout({ sessionId });

          if (result.error) {
            console.error(result.error.message);
          }
        } else {
          console.error(res.data.error);
          alert(res.data.error); // Display the error to the user
        }
      })
      .catch((err) => {
        console.error("Error creating checkout session:", err);
      });
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="mx-auto w-3/4 p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Medications List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Dosage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Frequency
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Medicine Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reorder
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medications.map((appointment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(appointment.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.dosage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.medicineName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleSubmit(appointment.medicineName)}
                    >
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>

  );
};

export default MedicationList;
