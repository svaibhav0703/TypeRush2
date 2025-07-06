import React from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { useRegisterMutation } from "../../redux/api/users";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (data) => {
    try {
      const { userName, password, confirmPass, email } = data;

      if (password.toString() !== confirmPass.toString()) {
        return toast.error("Passwords do not match");
      }

      const user = await registerUser({
        userName,
        password: password.toString(),
        email,
      }).unwrap();

      toast.success("Registration successful");
      dispatch(setCredentials({ ...user }));
      navigate("/user-page");
    } catch (error) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  const handleError = (errors) => {
    Object.values(errors).forEach((err) => {
      if (err?.message) toast.error(err.message);
    });
  };

  const handleGoogle = () => {
    window.location.href = "http://localhost:3000/api/v1/users/auth/google";
  };

  return (
    <div
      className="font-smooch-sans h-screen  flex flex-col items-center justify-center px-4 w-screen relative"
      style={{
        backgroundColor: "#050509",
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <Toaster position="top-center" />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-400 text-3xl hover:text-white hover:scale-105 transition"
      >
        &#8592; Back
      </button>

      <div className="border-1  border-[#2C2C2C] bg-[#050509] w-fit  rounded-4xl p-8 flex flex-col gap-3">
        <h1 className="text-white text-6xl text-center mb-4">Register</h1>

        <form
          onSubmit={handleSubmit(handleRegister, handleError)}
          className="flex flex-col gap-2"
        >
          <label className="text-gray-400 text-lg">Email</label>
          <input
            type="email"
            {...register("email", {
              maxLength: 30,
              required: { value: true, message: "Email is required" },
            })}
            className="h-12 border-1 w-100 border-[#2C2C2C] font-bold rounded-4xl text-white p-4"
            style={{
              backgroundColor: "#050509",
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "15px 15px",
            }}
            placeholder="Enter your email"
          />

          <label className="text-gray-400 text-lg">Username</label>
          <input
            type="text"
            {...register("userName", {
              maxLength: { value: 20, message: "Username is too long" },
              required: { value: true, message: "Username is required" },
            })}
            className="h-12 border-1 w-100 border-[#2C2C2C] font-bold rounded-4xl text-white p-4"
            style={{
              backgroundColor: "#050509",
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "15px 15px",
            }}
            placeholder="Enter your username"
          />

          <label className="text-gray-400 text-lg">Password</label>
          <input
            type="password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
            })}
            className="h-12 border-1 w-100 border-[#2C2C2C] font-bold rounded-4xl text-white p-4"
            style={{
              backgroundColor: "#050509",
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "15px 15px",
            }}
            placeholder="Enter your password"
          />

          <label className="text-gray-400 text-lg">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPass", {
              required: {
                value: true,
                message: "Please confirm your password",
              },
            })}
            className="h-12 border-1 w-100 border-[#2C2C2C] font-bold rounded-4xl text-white p-4"
            style={{
              backgroundColor: "#050509",
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "15px 15px",
            }}
            placeholder="Confirm your password"
          />

          <button
            type="submit"
            className="h-12 w-full text-gray-400 border-1 border-gray-400 rounded-4xl hover:text-white hover:bg-gradient-to-r from-indigo-500 to-purple-600 hover:border-none  font-bold transition delay-100 flex items-center justify-center"
          >
            Register
          </button>
        </form>

        <p className="text-white text-xl text-center">OR</p>

        <button
          onClick={handleGoogle}
          className="h-12 w-full rounded-4xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:border-none  font-bold transition delay-100 flex items-center justify-center gap-3"
        >
          Register with Google
          <svg
            width="24px"
            height="24px"
            viewBox="-0.5 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.9 0 6.6 1.6 8.1 3.1l6-6C34.4 2.8 29.7.5 24 .5 14.7.5 6.7 6.8 3.4 15.2l7.4 5.7C12.2 14 17.5 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.2 24.5c0-1.7-.2-3.4-.5-5H24v9.5h12.5c-1 3-3 5.6-5.6 7.4l8.6 6.7c5-4.7 7.7-11.6 7.7-18.6z"
            />
            <path
              fill="#4A90E2"
              d="M3.4 15.2c-1.6 3.2-2.4 6.8-2.4 10.3s.8 7.1 2.4 10.3l7.4-5.7c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6L3.4 15.2z"
            />
            <path
              fill="#FBBC05"
              d="M24 46c6.5 0 11.9-2.1 15.8-5.8l-8.6-6.7c-2.3 1.5-5.3 2.4-8.4 2.4-6.5 0-12.1-4.3-14.1-10.1l-7.4 5.7C6.7 41.2 14.7 46 24 46z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Register;
