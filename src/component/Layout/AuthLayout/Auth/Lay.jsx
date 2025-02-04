import LoginBackground from "../../../../assets/img1.jpeg";

export const Layout = ({ children }) => {
  return (
    <div
      className={`px-8 lg:pt-9 relative`}
      style={{
        backgroundImage: `url(${LoginBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 relative z-20 h-screen lg:h-[95vh]">
        <div className="flex flex-col justify-center items-center text-center lg:p-8">
          <div className="mb-4">
            <img
              src="/path-to-logo.png"
              alt="Logo Here"
              className="w-16 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">
            Document Organizing
          </h1>
          <p className="text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:w-[450px] rounded-t-3xl pt-7 h-auto flex justify-center items-center bg-white mx-auto">
        {children}

        </div>
        
      </div>   
    </div>
  );
};
