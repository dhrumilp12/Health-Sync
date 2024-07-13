import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const stripe = await loadStripe(
      "pk_test_51LCnRQSJSsOC2eKt1uhfUNxQU5bunGdtuP2dSRxFkoWYSLTuxCSTJVKMJZ0SiIajvoJb9JvgrMIF7VepheZ4Glhz00mbaU5Efs"
    );
    const medicineName = medications.medicineName;
    axios
      .post("http://localhost:5000/api/create-checkout-session", medicineName, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data); // Ensure you're logging the actual response data

          const sessionId = res.data.id; // Assuming your response data has an 'id' field
          console.log(sessionId);
          const result = stripe.redirectToCheckout({
            sessionId: sessionId,
          });

          if (result.error) {
            console.error(result.error.message);
          }
        }
      })
      .catch((err) => {
        console.error("Error creating checkout session:", err);
      });
  };
  console.log(medications);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="mx-auto w-3/4 p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Appointments List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  dosage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  frequency
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  medicineName
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
                      onClick={handleSubmit}
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
  );
};

export default MedicationList;
