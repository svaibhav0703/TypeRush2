import React, { useState, useEffect } from "react";
import { setCredentials } from "../../redux/slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useProfileMutation } from "../../redux/api/users.js";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import NavBar from "../user/NavBar.jsx";
const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);
  const onsubmit = async (data) => {
    if (data.password !== data.Cpassword) {
      toast("paasword mismatch");
      console.log("HI");
      return;
    } else {
      try {
        const userName = data.name;
        const email = data.email;
        const password = data.password;
        const newDetails = await updateProfile({
          userName,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...newDetails }));
        toast.success("profile updated");
      } catch (error) {
        console.log(error);
        toast.error(error.data.message);
      }
    }
  };

  return (
    <>
      <NavBar></NavBar>
      <div
        className=" min-h-[90vh] h-fit font-smooch-sans flex flex-col justify-center items-center gap-10 relative "
        style={{
          backgroundColor: "#050509",
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      >
        <Toaster position="top-center" />
        <div>
          <h1 className="text-white text-5xl font-bold">Update Profile</h1>
        </div>
        <div className="container border-1 border-[#2C2C2C] bg-[#050509] w-fit h-fit rounded-4xl p-10">
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="text-gray-400 flex flex-col  items-center "
          >
            <div className="  rounded-md p-5 flex flex-col">
              <label htmlFor="username" className="">
                Username
              </label>
              <input
                className="h-5 w-100 border-1 border-[#2C2C2C]  font-bold rounded-4xl text-white p-5 "
                style={{
                  backgroundColor: "#050509",
                  backgroundImage:
                    "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "15px 15px",
                }}
                type="text"
                {...register("name", { maxLength: 30 })}
                placeholder={userInfo?.userName}
              />
            </div>
            <div className="  rounded-md p-5 flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                className="h-5 w-100 border-1 border-[#2C2C2C]  font-bold rounded-4xl text-white p-5"
                style={{
                  backgroundColor: "#050509",
                  backgroundImage:
                    "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "15px 15px",
                }}
                type="text"
                {...register("email", { maxLength: 30 })}
                placeholder={userInfo?.email}
              />
            </div>
            <div className=" rounded-md p-5 flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                className="h-5 w-100 border-1 border-[#2C2C2C]  font-bold rounded-4xl text-white p-5"
                style={{
                  backgroundColor: "#050509",
                  backgroundImage:
                    "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "15px 15px",
                }}
                type="text"
                {...register("password", { maxLength: 30 })}
                placeholder="enter new password"
              />
            </div>
            <div className="  rounded-md p-5 flex flex-col">
              <label htmlFor="Cpassword" className="">
                Confirm password
              </label>
              <input
                className="h-5 w-100 border-1 border-[#2C2C2C]  font-bold rounded-4xl text-white p-5"
                style={{
                  backgroundColor: "#050509",
                  backgroundImage:
                    "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "15px 15px",
                }}
                type="text"
                {...register("Cpassword", { maxLength: 30 })}
                placeholder="confirm new password"
              />
            </div>
            <div className="h-[106px] w-[440px] flex flex-row justify-center items-center">
              <button
                className="h-10 w-100 border-1 border-gray-400 rounded-4xl hover:text-white hover:bg-gradient-to-r from-indigo-500 to-purple-600 hover:border-none  font-bold transition delay-100"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
