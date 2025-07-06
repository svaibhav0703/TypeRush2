import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { logout } from "../../redux/slices/authSlice";
import { useLogoutUserMutation } from "../../redux/api/users";
const NavBar = ({ Hidden }) => {
  const User = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Logout] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await Logout().unwrap();
      dispatch(logout());
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={` font-smooch-sans font-bold w-screen ${"text-xl"} bg-[#050509]`}
    >
      <div className="h-[10vh] flex justify-between gap-10 items-center pl-10 pr-10 pt-2 ">
        <div className="flex gap-10 items-center ">
          <button
            onClick={() => handleLogout()}
            className=" text-gray-400 hover:text-white transition delay-50 hover:-translate-y-0.5   "
          >
            Logout
          </button>
          <NavLink
            to="/user-page"
            className=" text-gray-400 hover:text-white transition delay-50 hover:-translate-y-0.5 "
          >
            Home
          </NavLink>

          <NavLink
            to="/user-page/stats"
            className=" text-gray-400 hover:text-white transition delay-50 hover:-translate-y-0.5 "
          >
            Stats
          </NavLink>
          <NavLink
            to="/user-page/practice"
            className=" text-gray-400 hover:text-white transition delay-50 hover:-translate-y-0.5 "
          >
            Practice
          </NavLink>
          <NavLink
            to="/user-page/challenge"
            className=" text-gray-400 hover:text-white transition delay-50 hover:-translate-y-0.5 "
          >
            Arena
          </NavLink>
          <NavLink
            to="/user-page/fastest-fingers"
            className=" text-gray-400 hover:text-white transition delay-50 hover:-translate-y-0.5 "
          >
            Fastest fingers
          </NavLink>
        </div>

        <NavLink
          to="/user-page/update-profile"
          className="flex gap-0.5  text-gray-400 hover:text-white transition delay-50 hover:-translate-y-0.5   rounded-mdp-2"
        >
          <span>{User?.userName}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
