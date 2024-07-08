const Button = ({ children }) => {
  return (
    <button className="bg-primary transition hover:bg-[#158ace] px-8 py-1 shadow-lg rounded-3xl text-black hover:text-white">
      {children}
    </button>
  );
};

export default Button;
