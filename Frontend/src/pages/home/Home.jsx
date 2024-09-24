import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
  return (
    // <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-white">

    <div className="w-full max-w-7xl flex sm:h-[450px] md:h-[600px] rounded-lg overflow-hidden bg-stone-500 bg-clip-padding backdrop-filter  backdrop-blur-md bg-opacity-20 backdrop-saturate-100 backdrop-contrast-75">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};
export default Home;
