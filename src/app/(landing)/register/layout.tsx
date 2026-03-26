const RegisterLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className={`min-h-svh grid items-center px-4 pt-4 md:pt-0`}>
      {children}
    </main>
  );
}

export default RegisterLayout;