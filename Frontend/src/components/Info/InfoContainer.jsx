import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { CiCalendar, CiMail, CiMobile3 } from "react-icons/ci";
import { BsGenderAmbiguous } from "react-icons/bs";

const InfoContainer = () => {
  return (
    <div className="md:min-w-[250px] bg-white border-l-gray-200 border-l-2 overflow-auto">
      <div className="p-2">
        <div className="flex justify-center py-4 mt-4">
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-28 rounded-full ring ring-offset-2">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Michael Wong
            </h2>
            <p className="text-sm text-gray-500">UX/UI Designer</p>
          </div>

          <div className="flex justify-center space-x-4 mt-4 py-2">
            <a href="#" className="">
              <FaInstagram />
            </a>
            <a href="#" className="">
              <FaXTwitter />
            </a>
            <a href="#" className="">
              <FaLinkedin />
            </a>
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 flex justify-center items-center gap-1">
              <span>
                <FaRegEdit />
              </span>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="p-2 px-4 border-t-gray-200 border-t-2">
          <h3 className="font-bold">Mobile</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">+430 332 4567</span>
            <CiMobile3 className="text-gray-500 mr-2" size={20} />
          </div>
        </div>
        <div className="p-2 px-4 ">
          <h3 className="font-bold">Email</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">mizko@gmail.com</span>
            <CiMail className="text-gray-500 mr-2" size={20} />
          </div>
        </div>
        <div className="p-2 px-4">
          <h3 className="font-bold">Date of Birth</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">02/12/1990</span>
            <CiCalendar className="text-gray-500 mr-2" size={20} />
          </div>
        </div>
        <div className="p-2 px-4 ">
          <h3 className="font-bold">Gender</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Male</span>
            <BsGenderAmbiguous className="text-gray-500 mr-2" size={20} />
          </div>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
};

export default InfoContainer;
