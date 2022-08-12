import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/images/profile.png";
import Item2 from "../components/Item2";
import ItemCard from "../components/ItemCard";
import Button from "../components/UI/Button";
import { useAuth } from "../contexts/AuthContext";
// import { useStateContext } from "../contexts/ContextProvider";
export default function NotSubscribed({ disabled }) {
  // const { users } = useStateContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  return (
    <div className="z-30 mt-[90px] absolute px-6 flex items-center justify-center w-full md:w-[calc(100vw-160px)] h-[calc(100vh-90px)] ">
      <div className="-mt-[90px] bg-stone-100 px-6 sm:px-12 py-6 sm:py-10  rounded-3xl drop-shadow-xl ">
        {disabled ? (
          <h3 className="mb-4 text-sm sm:text-lg text-rose-600 font-medium">
            Features inaccessible !
          </h3>
        ) : (
          <h3 className="mb-4 text-sm sm:text-lg text-rose-600 font-medium">
            Features Disabled !
          </h3>
        )}
        {disabled ? (
          <p className="text-xl sm:text-3xl text-gray-700 font-semibold">
            Your account has been{" "}
            <span className="text-rose-600 font-bold">Disabled</span>.
          </p>
        ) : (
          <p className="text-xl sm:text-3xl text-gray-700 font-semibold">
            You are <span className="text-rose-600 font-bold">NOT</span>{" "}
            subscribed to any plan.
          </p>
        )}
        <div className="mt-8 sm:mt-14 flex justify-end text-sm text-white">
          {disabled ? (
            <Button
              fullWidth
              onClick={() => {
                logout();
                navigate("/");
              }}
              type={"button"}
            >
              <p className="text-lg font-medium">Signout</p>
            </Button>
          ) : (
            <Button
              fullWidth
              onClick={() => navigate("/subscription")}
              type={"button"}
            >
              <p className="text-lg font-medium">Subscribe Now</p>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
