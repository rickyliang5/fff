import React, { useEffect, useState } from "react";
import axios from 'axios';
import Table from "./userAccountTable";
import "./UserTable.css"; // Import CSS file for styling

export const UserTable = () => {
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/data");
                setUserData(response.data);
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="gridcontainer">
            <header className="header">

            </header>

            <section className="sidebar">
                <h2>Frank Financial Funds</h2>
                <ul>
                    <li><a href="/user-table"><i className="fa-solid fa-house"></i> Managment Home</a></li>
                    <li><a href="/mgmtLogin"><i className="fa-solid fa-check-to-slot"></i> Log Out</a></li>
                </ul>
            </section>
            <div className="main" style={{display:'flex', justifyContent:'center'}}>
                <main className="">
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-4">
                        {/* Page header content */}
                    </header>
                    <div className="card">
                        <div className="card mb-4">
                            <div className="card-header">
                                {/* Card header content */}
                            </div>
                            <div>
                                {/* Table component */}
                                <Table data={userData} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
