import { useState, useEffect } from "react";
import { FaUsers, FaAddressBook } from "react-icons/fa";
import { fetchAdminDashboard } from "../../api/api"; // Adjust the import path as needed

const DashboardAdmin = () => {
  const [data, setData] = useState({
    employee: 0,
    no_assign_employee: 0,
    no_not_assign_employee: 0,
    total_application: 0,
    total_completed_status: 0,
    total_pending_status: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data..."); // Debugging Log

        const token = localStorage.getItem("jwt_token");
        if (!token) {
          console.error("Token not found!");
          return;
        }

        console.log("Token:", token);

        // Fetch Employee Data
        console.log("Calling Employee API...");
        const employeeResponse = await fetchAdminDashboard(
          `/admin/dashboard/all_employee`,
          "get",
          {},
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Employee API Response:", employeeResponse);

        // Fetch Applications Data
        console.log("Calling Applications API...");
        const applicationResponse = await fetchAdminDashboard(
          `/admin/dashboard/all_applicantion`,
          "get",
          {},
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Applications API Response:", applicationResponse);

        if (
          employeeResponse.data?.success &&
          applicationResponse.data?.success
        ) {
          const newData = {
            employee: employeeResponse.data?.payload?.total_count || 0,
            no_assign_employee:
              applicationResponse.data?.payload?.no_assign_employee || 0,
            no_not_assign_employee:
              applicationResponse.data?.payload?.no_not_assign_employee || 0,
            total_application:
              applicationResponse.data?.payload?.total_application || 0,
            total_completed_status:
              applicationResponse.data?.payload?.total_completed_status || 0,
            total_pending_status:
              applicationResponse.data?.payload?.total_pending_status || 0,
          };

          console.log("Setting Data:", newData);
          setData(newData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Employee", count: data.employee, icon: <FaUsers /> },
          {
            title: "Alloted To Employees",
            count: data.no_assign_employee,
            subtitle: "Applications",
            icon: <FaUsers />,
          },
          {
            title: "Unalloted To Employees",
            count: data.no_not_assign_employee,
            subtitle: "Applications",
            icon: <FaUsers />,
          },
          {
            title: "Total Applications",
            count: data.total_application,
            icon: <FaAddressBook />,
          },
          {
            title: "Applications Completed",
            count: data.total_completed_status,
            icon: <FaAddressBook />,
          },
          {
            title: "Applications Pending",
            count: data.total_pending_status,
            icon: <FaAddressBook />,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 flex items-center"
          >
            <div className="flex-1">
              <h5 className="text-gray-600 text-sm uppercase">{item.title}</h5>
              <span className="text-3xl font-bold text-blue-600">
                {item.count}
              </span>
            </div>
            <div className="text-blue-600 text-4xl">{item.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
