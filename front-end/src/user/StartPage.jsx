import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, redirect } from "react-router";
import { useGetUserQuery } from "../../redux/api/users.js";
import { setCredentials } from "../../redux/slices/authSlice.js";
import { useNavigate } from "react-router";

const StartPage = () => {
  // storing the data into localstorage
  const { data: User } = useGetUserQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCredentials(User));
  }, [User]);
  const navigate = useNavigate();

  return <div>{User ? <Outlet /> : null}</div>;
};

export default StartPage;
