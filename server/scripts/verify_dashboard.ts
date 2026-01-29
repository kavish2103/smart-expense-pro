import axios from "axios";

const verify = async () => {
    try {
        const email = `test${Date.now()}@example.com`;
        const password = "password123";

        // 1. Register
        console.log(`Registering ${email}...`);
        await axios.post("http://localhost:5000/auth/register", {
            email,
            password,
            name: "Test User"
        });

        // 2. Login
        console.log("Logging in...");
        const loginRes = await axios.post("http://localhost:5000/auth/login", {
            email,
            password
        });
        const token = loginRes.data.token;
        console.log("Login successful. Token acquired.");

        // 2. Fetch Dashboard
        console.log("Fetching dashboard stats...");
        const dashRes = await axios.get("http://localhost:5000/api/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Dashboard Status:", dashRes.status);
        console.log("Dashboard Data:", JSON.stringify(dashRes.data, null, 2));

    } catch (error: any) {
        console.error("Verification Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

verify();
