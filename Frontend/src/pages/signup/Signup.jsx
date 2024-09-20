import GenderCheckbox from "./GenderCheckbox";

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-800 bg-opacity-80 backdrop-blur-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up
          <span className="text-blue-500"> ChatApp</span>
        </h1>

        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-3 py-2 text-gray-900 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full px-3 py-2 text-gray-900 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-3 py-2 text-gray-900 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 text-gray-900 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* GenderCheckbox Component */}
          <GenderCheckbox />

          <a
            className="text-sm text-gray-400 hover:underline hover:text-blue-500 mt-2 inline-block"
            href="#"
          >
            Already have an account?
          </a>

          <div className="mt-6">
            <button className="w-full py-2 bg-blue-500 text-gray-100 rounded-md hover:bg-blue-600 transition">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
