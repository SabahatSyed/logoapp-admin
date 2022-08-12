import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

import { collection, doc, updateDoc, Timestamp } from "firebase/firestore";

import { db } from "../firebase-config";
import { useStateContext } from "../contexts/ContextProvider";
import Spinner from "./UI/Spinner";
import { useAuth } from "../contexts/AuthContext";

export default function CheckoutForm({ selectedPlanId }) {
  const { currentUser } = useAuth();
  const { subscriptions, selectedUserInfo, updateCheck } = useStateContext();
  // console.log(selectedUserInfo[0]);
  const selectedSubscription = subscriptions.filter(
    (sub) => sub.id === selectedPlanId
  );
  // console.log(selectedSubscription);

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    // console.log(clientSecret);

    if (!clientSecret) {
      // console.log("notclientsecret");
      return;
    }
    console.log("clientsecret");

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {};
    setMessage(null);
    setIsLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const response = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: "http://localhost:3000/dashboard/home",
        receipt_email: selectedUserInfo[0]?.email,
      },
    });

    if (response.error) {
      if (
        response.error.type === "card_error" ||
        response.error.type === "validation_error"
      ) {
        setMessage(response.error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
      data = {
        activeSubscription: {
          ...selectedSubscription[0],
          subscriptionDate: Timestamp.fromDate(new Date()),
          expirationDate: Timestamp.fromDate(new Date(Date.now() + 2629800000)), //1 month in milliseconds
          // expirationDate: Timestamp.fromDate(new Date(Date.now() + 3000)), //30 in milliseconds
        },
        /* notifications: [
          ...selectedUserInfo[0]?.notifications,
          {
            title: "Success",
            message: `You have subscribed to ${selectedSubscription[0].name} plan`,
            id: Date.now(),
          },
        ],
        unreadNotifications: selectedUserInfo[0]?.unreadNotifications + 1, */
      };
      console.log(data);
      try {
        await updateDoc(doc(collection(db, "users"), currentUser?.uid), data);
        updateCheck();
      } catch (error) {
        console.log(error);
      }
      console.log("payment success");
      navigate("/dashboard/home");
    }

    console.log(response);
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white max-w-xl shadow-xl p-10 rounded-md"
    >
      <>
        <h3 className="mb-6 text-2xl text-primary-500 font-bold">
          Card Details
        </h3>
        <PaymentElement />
        {stripe && elements && (
          <div className="sm:flex sm:gap-4">
            <button
              type="submit"
              disabled={isLoading || !stripe || !elements}
              className="flex items-center justify-center mt-6 px-6 py-3 w-full bg-primary-500 text-white text-lg font-medium rounded-md hover:bg-primary-400 hover:scale-105 active:scale-100 active:bg-primary-500 hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Spinner alt /> Processing
                </>
              ) : (
                "Proceed"
              )}
            </button>
            <button
              type="button"
              className="mt-6 px-6 py-3 w-full bg-primary-500 text-white text-lg font-medium rounded-md hover:bg-primary-400 hover:scale-105 active:scale-100 active:bg-primary-500 hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/dashboard/home")}
            >
              Cancel
            </button>
          </div>
        )}
      </>

      {/* Show any error or success messages */}
      {message && (
        <div className="mt-4 px-4 py-2 text-rose-600 text-center rounded-lg border border-rose-600">
          {message}
        </div>
      )}
    </form>
  );
}
