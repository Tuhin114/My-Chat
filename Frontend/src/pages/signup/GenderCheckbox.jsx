const GenderCheckbox = () => {
  return (
    <div className="flex space-x-4 mt-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="male"
          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="male" className="ml-2 text-sm text-gray-300">
          Male
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="female"
          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="female" className="ml-2 text-sm text-gray-300">
          Female
        </label>
      </div>
    </div>
  );
};

export default GenderCheckbox;
