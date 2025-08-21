"use client";

import Header from "@/components/custom/Header";
import HoverSidebar from "@/components/custom/HoverSidebar";
import { UserDetailContext } from "@/context/UserDetailContext";
import Lookup from "@/data/Lookup";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import React, { useContext } from "react";
import { api } from "../../../../convex/_generated/api";

function Pricing() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const UpdateToken = useMutation(api.users.UpdateToken);

  const initialFreeTokens = 10000;
  const tokenPercentage = userDetails?.token
    ? Math.min((userDetails.token / initialFreeTokens) * 100, 100)
    : 0;

  const displayOrder = ["Free Trial", "Pro", "Basic"];
  const sortedPricingOptions = [...Lookup.PRICING_OPTIONS].sort(
    (a, b) => displayOrder.indexOf(a.name) - displayOrder.indexOf(b.name)
  );

  const onPaymentSuccess = async (plan) => {
    const newTokenBalance = userDetails?.token + plan.value;
    await UpdateToken({
      userId: userDetails._id,
      token: newTokenBalance,
    });

    setUserDetails((prev) => ({
      ...prev,
      token: newTokenBalance,
    }));
  };

  return (
    <div className="bg-background text-white min-h-screen antialiased">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-primary bg-custom-blue text-transparent bg-clip-text">
              Flexible Plans
            </span>{" "}
            for Every Project
          </h1>
          <p className="text-lg text-gray-400">{Lookup.PRICING_DESC}</p>
        </div>

        {userDetails && (
          <div className="max-w-xl mx-auto my-12 p-6 backdrop-blur-xl shadow-lg border border-white/10 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300 font-medium">
                Your Token Balance
              </span>
              <span className="font-bold text-lg text-primary">
                {userDetails.token.toLocaleString()} Tokens Left
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary bg-custom-blue h-2.5 rounded-full transition-all ease-in-out duration-500"
                style={{ width: `${tokenPercentage}%` }}
              ></div>
            </div>
            <div className="text-center mt-5">
              <p className="text-gray-400">
                Need more tokens?{" "}
                <span className="font-semibold text-white">
                  Update your plan below.
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16 items-center">
          {sortedPricingOptions.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-xl border flex flex-col h-full transition-all duration-300 transform hover:-translate-y-2 ${
                plan.name === "Pro"
                  ? "bg-chat-background/80 border-2 border-primary lg:scale-105 shadow-2xl shadow-primary/10"
                  : "bg-chat-background/40 border-gray-700 hover:border-primary/50"
              }`}
            >
              {plan.name === "Pro" && (
                <div className="text-center -mt-12 mb-6">
                  <span className="inline-block bg-primary text-gray-900 text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-primary font-semibold text-lg my-2">
                  {plan.tokens} Tokens
                </p>
                <div className="my-6">
                  <span className="text-5xl font-extrabold text-white">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                </div>
                <p className="text-gray-400 h-24">{plan.desc}</p>
              </div>

              {plan.price === 0 ? (
                <button
                  className="w-full py-3 mt-8 font-bold rounded-lg text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 bg-gray-700 text-white hover:bg-primary hover:text-gray-900"
                  disabled
                >
                  Already Applied
                </button>
              ) : (
                <div className="mt-8 relative">
                  <button
                    className={`w-full py-3 font-bold rounded-lg text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 ${
                      plan.name === "Pro"
                        ? "bg-primary text-gray-900 hover:bg-primary"
                        : "bg-gray-700 text-white hover:bg-primary hover:text-gray-900"
                    }`}
                  >
                    {`Choose ${plan.name} Plan`}
                  </button>

                  <div className="absolute inset-0 opacity-0">
                    <PayPalButtons
                      disabled={!userDetails}
                      style={{
                        layout: "horizontal",
                        height: 48,
                        color: "blue",
                        shape: "rect",
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: plan.price,
                                currency_code: "USD",
                              },
                              description: `${plan.name} Plan - ${plan.tokens} Tokens`,
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        const details = await actions.order.capture();
                        await onPaymentSuccess(plan);
                        return details;
                      }}
                      onError={(err) => {
                        console.error("PayPal Checkout onError", err);
                      }}
                      onCancel={(data) => {
                        console.log("PayPal Checkout onCancel", data);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <HoverSidebar />
    </div>
  );
}

export default Pricing;
