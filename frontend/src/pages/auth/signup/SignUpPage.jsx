import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isError, setisError] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          setisError(true);
          seterrorMsg(data.message);
          return;
        }
        setisError(false);
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: ["me"],
        });
        navigate("/");
      } catch (error) {
        setisError(true);
        seterrorMsg("internal server error", error.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.email === "" ||
      formData.username === "" ||
      formData.fullName === "" ||
      formData.password === ""
    ) {
      setisError(true);
      seterrorMsg("please provide all inputs");
      return;
    }
    setisError(false);
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isPassword, setIsPassword] = useState(true);
  return (
    <div className="max-w-7xl mx-auto  flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <h1 className="text-[clamp(3rem,22vw,49rem)] text-white select-none font-black font-serif lg:w-2/3">
          J
        </h1>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 items-center  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <h1 className="text-[clamp(10rem,22vw,49rem)]  text-white select-none font-black font-serif lg:hidden lg:w-2/3">
            J
          </h1>
          <h1 className="text-4xl font-extrabold select-none text-white">
            Join today.
          </h1>
          <label className="input select-none input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input select-none input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser className="select-none" />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input select-none input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline className="select-none" />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input select-none input-bordered rounded flex items-center gap-2">
            <MdPassword className="select-none" />
            <input
              type={isPassword ? "password" : "text"}
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
            <div
              onClick={() => {
                isPassword ? setIsPassword(false) : setIsPassword(true);
              }}
              className="cursor-pointer "
            >
              {isPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </div>
          </label>
          <button className="btn rounded-full btn-primary w-65 h-15 bg-blue-600 text-white">
            {isPending ? "Loading" : "sign up"}
          </button>
          {isError && <p className="text-red-500">{errorMsg}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg select-none">
            Already have an account?
          </p>
          <Link to="/login">
            <button className="btn   rounded-full btn-primary text-blue-500 btn-outline w-full">
              login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
