import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BackgroundDashboard from "../components/UI/BackgroundDashboard";
import BusinessSidebar from "../components/UI/BusinessSidebar";
import DetailsSidebar from "../components/UI/DetailsSidebar";
// import { Outlet } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import Sidebar from "../components/UI/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase-config";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Alert from "../components/UI/Alert";
import NotSubscribed from "./NotSubscribed";
import { useStateContext } from "../contexts/ContextProvider";
import Spinner from "../components/UI/Spinner";
// import HomeBackground from "../components/HomeBackground";
// import { useStateContext } from "../contexts/ContextProvider";

const BusinessDashboard = () => {
  // const { selectedUserInfo } = useStateContext();
  // console.log(selectedUserInfo);
  const location = useLocation();
  const { currentUser } = useAuth();

  const [open, setOpen] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const selectedUserInfo = useDocumentData(
    doc(collection(db, "users"), currentUser?.uid)
  );
  console.log(selectedUserInfo[1]);

  useEffect(() => {
    const checkDate = async () => {
      if (selectedUserInfo[0]?.activeSubscription) {
        console.log("subscribe");
        const dateToday = new Date().getTime();
        const expirationDate =
          selectedUserInfo[0]?.activeSubscription?.expirationDate
            .toDate()
            .getTime();
        if (expirationDate <= dateToday) {
          console.log("expirationDate");
          await updateDoc(doc(collection(db, "users"), currentUser?.uid), {
            activeSubscription: null,
          });

          console.log("subscription expired");
        }
      } else {
        console.log("no subscription");
      }
    };

    checkDate();
  }, [currentUser?.uid, location.pathname, selectedUserInfo]);

  return (
    <>
      {/* <HomeBackground /> */}
      <BackgroundDashboard />

      <BusinessSidebar
        open={open}
        setOpen={setOpen}
        showBackdrop={showBackdrop}
        setShowBackdrop={setShowBackdrop}
      />

      <Navbar
        open={open}
        setOpen={setOpen}
        showBackdrop={showBackdrop}
        setShowBackdrop={setShowBackdrop}
      />

      <DetailsSidebar
        open={open}
        setOpen={setOpen}
        showBackdrop={showBackdrop}
        setShowBackdrop={setShowBackdrop}
      />
      {!selectedUserInfo[1] ? (
        <div
          className={`pt-14 md:pt-0 md:ml-40 overflow-hidden transition-all duration-500 ease-out `}
        >
          {/* <div className="fixed bottom-6 right-6">
            <Alert title={"Success"} color={"emerald"}>
              <p className="text-sm text-gray-600">
                You successfully Subscribed
              </p>
            </Alert>
          </div> */}
          {selectedUserInfo[0]?.isDisabled && <NotSubscribed disabled />}
          {!selectedUserInfo[0]?.isDisabled &&
            !selectedUserInfo[0]?.activeSubscription && <NotSubscribed />}
          <div
            className={`${
              !selectedUserInfo[0]?.activeSubscription &&
              "blur-sm opacity-50 h-screen"
            }`}
          >
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen flex items-center justify-center text-primary-500">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default BusinessDashboard;
