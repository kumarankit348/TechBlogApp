import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerAction } from "../../redux/slices/users/userSlices";
import ErrorMsg from "../Alert/ErrorMsg";
import SuccessMsg from "../Alert/SuccessMsg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  //handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    //dispatch action
    dispatch(
      registerAction({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
    );

    // reset form
    setFormData({
      email: "",
      password: "",
      username: "",
    });
  };

  // store data
  const { error, success } = useSelector((state) => state?.users);

  useEffect(() => {
    // check if registration was successful
    if (success) {
      navigate("/posts"); // redirect to posts page
    }
  }, [success, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center min-h-screen bg-gray-50 px-4"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 md:p-12">
        <div className="relative -top-2 -mt-16 mb-6">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-green-500 text-6xl mb-6"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Join our community
        </h2>
        {error && <ErrorMsg message={error?.message} />}
        {success && (
          <SuccessMsg message="Registration successful! Please login." />
        )}
        <p className="text-center text-gray-500 mb-6">
          Create your account to continue
        </p>

        <label className="mb-4 flex flex-col w-full">
          <span className="mb-1 text-gray-800 font-medium">Username</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <label className="mb-4 flex flex-col w-full">
          <span className="mb-1 text-gray-800 font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <label className="mb-6 flex flex-col w-full">
          <span className="mb-1 text-gray-800 font-medium">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition duration-200"
        >
          Get Started
        </button>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 hover:text-green-600 font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Register;
