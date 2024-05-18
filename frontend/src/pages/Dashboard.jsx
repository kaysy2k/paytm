import axios from "axios"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useEffect, useState } from "react"

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [logo, setLogo] = useState("");

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                console.log(response.data);
                
                setBalance(response.data.balance);
            } catch (error) {
                
                console.error("Error fetching balance:", error);
            }
        }
        fetchBalance();
    }, []);

    return <div>
        <Appbar logo={"logo"} />
        <div className="m-8">
            <Balance value={balance !== null ? balance : "Loading ..."} />
            <Users />
        </div>
    </div>
}