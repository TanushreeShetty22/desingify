const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div
        style={{ backgroundImage: "url('/BG1.png')" }}
        className="h-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      >
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
