function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-full bg-white dark:bg-gray-700 flex items-center justify-center">
      {children}
    </div>
  );
}

export default layout;
