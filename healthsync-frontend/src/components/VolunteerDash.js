import React, { useState } from "react";

const VolunteerDash = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const requests = [
    {
      id: 1,
      name: "John Doe",
      date: "2024-07-09",
      time: "10:00 AM",
      location: "123 Main St",
      interest: "Reading",
      needs: "Grocery Shopping",
    },
    // Add more requests here
  ];

  const handleAccept = (id) => {
    console.log(`Accepted request ${id}`);
  };

  const handleReject = (id) => {
    console.log(`Rejected request ${id}`);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-xl font-bold">Volunteer Dashboard</div>
        <div className="flex-grow">
          <button
            className={`w-full py-2 px-4 text-left ${
              activeTab === "requests" ? "bg-blue-800" : "bg-blue-700"
            } hover:bg-blue-800`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </button>
          <button
            className={`w-full py-2 px-4 text-left ${
              activeTab === "profile" ? "bg-blue-800" : "bg-blue-700"
            } hover:bg-blue-800`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>
      </div>
      <div className="flex-grow p-6">
        {activeTab === "requests" ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Elderly Requests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Time</th>
                    <th className="py-2 px-4 border-b">Location</th>
                    <th className="py-2 px-4 border-b">Interest</th>
                    <th className="py-2 px-4 border-b">Needs</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="py-2 px-4 border-b">{request.name}</td>
                      <td className="py-2 px-4 border-b">{request.date}</td>
                      <td className="py-2 px-4 border-b">{request.time}</td>
                      <td className="py-2 px-4 border-b">{request.location}</td>
                      <td className="py-2 px-4 border-b">{request.interest}</td>
                      <td className="py-2 px-4 border-b">{request.needs}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                          onClick={() => handleAccept(request.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p>Volunteer profile details go here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDash;
