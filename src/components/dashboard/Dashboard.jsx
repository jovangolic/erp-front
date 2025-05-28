import React, { useEffect, useState } from "react";
import { getDashboardData } from "../utils/AppFunction"; // API poziv

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const data = await getDashboardData(); // Poziv za dashboard podatke
            setDashboardData(data);
        };

        fetchDashboardData();
    }, []);

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Dashboard</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Users</h5>
                            <p className="card-text">{dashboardData.totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Sales Orders</h5>
                            <p className="card-text">{dashboardData.totalSalesOrders}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Total Revenue</h5>
                            <p className="card-text">${dashboardData.totalRevenue}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
