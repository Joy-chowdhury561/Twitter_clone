import { useState } from "react";
import { Link, } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { IoEyeOffOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const navigate=useNavigate()
  const [isError, setisError] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          setisError(true);
          return seterrorMsg(data.message);
        }
        setisError(false);

        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: ["me"],
        });
        navigate("/")
      } catch (error) {
        setisError(true);
        seterrorMsg( error.message ||"internal server error" );
      }
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username === "" || formData.password === "") {
      setisError(true);
      seterrorMsg("please fill out all inputs");
      return;
    }
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [isPassword, setIsPassword] = useState(true);
  return (
    <div className="max-w-7xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <h1 className="text-[clamp(3rem,22vw,49rem)] text-white select-none font-black font-serif lg:w-2/3">
          J
        </h1>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="flex items-center gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <h1 className="text-[clamp(10rem,22vw,49rem)] text-white select-none font-black font-serif lg:hidden lg:w-2/3">
            J
          </h1>
          <h1 className="text-4xl font-extrabold select-none  text-white">
            welcome back!
          </h1>
          <label className="input input-bordered select-none rounded flex items-center gap-2">
            <MdOutlineMail className="select-none" />
            <input
              type="text"
              className="grow"
              placeholder="username/email"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered select-none rounded flex items-center gap-2">
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
          <button
            disabled={isPending}
            className="btn rounded-full w-65 h-15 bg-blue-600 btn-primary text-white"
          >
            {isPending ? "Loading..." : "Login"}
          </button>
          {isError && <p className="text-red-500">{errorMsg}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg select-none">
            {"Don't"} have an account?
          </p>
          <Link to="/signup">
            <button className="btn   rounded-full btn-primary text-blue-500 btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
