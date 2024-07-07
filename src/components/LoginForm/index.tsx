import {
  forgotPassword,
  signInWithEmail,
  signInWithGoogle,
} from "@/firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaGoogle } from "react-icons/fa";

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);

  const [formData, setFormData] = React.useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    setLoading(true);
    const { result, error } = await signInWithEmail(
      formData.email,
      formData.password
    );

    if (error) {
      console.log(error);
      alert(error);
    }

    console.log(result);
    setLoading(false);
    setDisabled(false);
  };

  const handleGoogle = async () => {
    setDisabled(true);
    setLoadingGoogle(true);
    const { result, error } = await signInWithGoogle();

    if (error) {
      alert(error);
      console.log(error);
    }

    console.log(result);
    setLoadingGoogle(false);
    setDisabled(false);
  };

  const handleForgotPassword = async () => {
    setDisabled(true);

    const { result, error } = await forgotPassword(formData.email);

    if (error) {
      alert(error);
      console.log(error);
    }
    
    console.log(result);
    setDisabled(false);
  };

  return (
    <div className="px-4 md:px-8 py-10 md:border-2 border-gray-600 rounded-2xl md:min-w-[400px]">
      <form className="mx-auto space-y-4" onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            className="grow"
            placeholder="Email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
            required
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            placeholder="Password"
            className="grow"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            value={formData.password}
            required
          />
        </label>
        <p className="text-xs text-right">
          <button className="underline" disabled={disabled} type="button" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        </p>
        <button
          type="submit"
          disabled={disabled}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <svg
                className="w-6 h-6 -ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              <span className="ml-3">Log In</span>
            </>
          )}
        </button>
        <p className="mt-6 text-xs text-center">
          Don&apos;t have an account?{" "}
          <Link href={"/signup"} className="underline">
            Sign Up
          </Link>{" "}
          Today
        </p>
      </form>
      <div className="my-12 border-b text-center">
        <div className="px-2 inline-block text-sm  tracking-wide font-medium bg-base-100 transform translate-y-1/2">
          OR
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="btn btn-secondary w-full"
          disabled={disabled}
          onClick={handleGoogle}
        >
          {loadingGoogle ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <FaGoogle size={20} />
              <span className="ml-4">Log In with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
