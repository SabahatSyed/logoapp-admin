import {
  collection,
  collectionGroup,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { db } from "../../firebase-config";

export default function Dropdown({ children, isNotification }) {
  const { selectedUserInfo, updateCheck } = useStateContext();
  const navigate = useNavigate();

  //   console.log(selectedUserInfo);
  return (
    <div class="flex items-center justify-center">
      <div class="relative inline-block bg">
        {/* <!-- Dropdown toggle button --> */}
        <div>{children}</div>
        {/* <!-- Dropdown menu --> */}
        {isNotification && (
          <div class="absolute -right-40 md:right-0 z-20 p-2 overflow-hidden bg-white rounded-md shadow-lg drop-shadow-2xl w-[300px] md:w-80">
            <div class=" max-h-[50vh] overflow-y-auto overflow-x-hidden">
              {selectedUserInfo[0]?.notifications?.length > 0 ? (
                <>
                  {selectedUserInfo[0]?.notifications.map((notification) => {
                    return (
                      <div
                        key={notification.id}
                        class={`flex items-center px-2 py-1 transition-all duration-300 transform border-b border-gray-300 hover:bg-gray-100`}
                      >
                        <div
                          class={`h-14 w-2 ${
                            notification.title === "Success"
                              ? "bg-emerald-500"
                              : "bg-rose-600"
                          }`}
                        />
                        <div class="flex py-2 ml-4">
                          <div class="">
                            <span
                              class={`font-semibold ${
                                notification.title === "Success"
                                  ? "text-emerald-500"
                                  : "text-rose-600"
                              }`}
                            >
                              {notification.title}
                            </span>
                            <p className="text-sm text-gray-500">
                              {notification.message}
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              const data = {
                                notifications:
                                  selectedUserInfo[0].notifications.filter(
                                    (item) => item.id !== notification.id
                                  ),
                              };
                              await updateDoc(
                                doc(
                                  collection(db, "users"),
                                  selectedUserInfo[0].businessId
                                ),
                                data
                              );
                              updateCheck();
                            }}
                            className="flex items-start"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class=" h-6 w-6 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div
                  class={`flex items-center justify-center px-2 py-1 transition-all duration-300 transform border-b border-gray-300 hover:bg-gray-100`}
                >
                  <p className="">No Notifications</p>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/subscription")}
              class="w-full mt-10 block py-2 font-bold text-center text-white bg-primary-500 bg-opacity-90  hover:underline"
            >
              Subscriptions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
