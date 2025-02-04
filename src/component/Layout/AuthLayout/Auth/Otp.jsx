import React, { useEffect, useState } from "react";
import { Layout } from "./Lay";
import PinInput from "react-pin-input";
import Countdown from "react-countdown";
import { useDispatch } from "react-redux";
import { verifyOtpFunApi } from "store/auth/services";
import { useLocation, useNavigate } from "react-router-dom";

export const OtpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [startTimer, setStartTimer] = useState(false);
  const [myPhone, setMyPhone] = useState("");
  console.log("myPhone", myPhone);

  const handleSubmit = (value) => {
    if (value.length === 6) {
      dispatch(
        verifyOtpFunApi({
          data: {
            email: myPhone,
            otp: value,
          },
          onSuccess: () => {
            navigate("/login");
          },
        })
      );
    }
  };

  const resendOtp = () => {
    setStartTimer(true);
    // dispatch(
    //   forgetPasswordFunApi({
    //     data: { email: myPhone },
    //     onSuccess: () => {
    //       toast.success("Otp Sent Successfully");
    //     },
    //   })
    // );
  };

  const addLeadingZero = (number) => {
    return number < 10 ? `0${number}` : `${number}`;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    if (email) {
      setMyPhone(email);
    }
  }, [location.search]);

  return (
    <Layout>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md rounded-lg">
          <h1 className="text-1xl text-gray-700  mb-4">Verify Your Email</h1>
          <p className="text-sm text-gray-500 mb-6">
            <div>we have sent an verification email </div>
            <div>to your dev@gmail.com</div>
          </p>

          <div className="flex justify-center mb-6">
            <PinInput
              length={6}
              initialValue=""
              secret={false}
              //   disabled={isLoading}
              onChange={() => {}}
              type="numeric"
              inputMode="number"
              style={{ display: "flex", gap: "10px" }}
              inputStyle={{
                width: "35px",
                height: "35px",
                textAlign: "center",
              }}
              inputFocusStyle={{
                border: "1px solid #3b82f6",
              }}
              onComplete={(value) => handleSubmit(value)}
              autoSelect
            />
          </div>
          <div className="py-4">Didn’t receive Otp? check spam folder or</div>

          <div className="text-center mb-4 w-full bg-black text-white py-3 rounded-md">
            <button
              disabled={startTimer}
              className={`font-semibold ${
                startTimer ? "cursor-not-allowed" : ""
              }`}
              onClick={resendOtp}
            >
              {startTimer ? (
                <Countdown
                  date={Date.now() + 60000}
                  renderer={({ minutes, seconds }) => (
                    <span>
                      {addLeadingZero(minutes)}:{addLeadingZero(seconds)}
                    </span>
                  )}
                  onComplete={() => setStartTimer(false)}
                />
              ) : (
                "Resend Email"
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
