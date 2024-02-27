const Container = ({ children, title }) => {
  return (
    <div className="my-5 py-5">
      <h3 className="text-center text-3xl ">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Container;
