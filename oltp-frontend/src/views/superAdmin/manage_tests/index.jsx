import TestTable from "./components/testTable";


const ManageTests = () => {
  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-3">
        <TestTable />
      </div>
    </div>
  );
};

export default ManageTests;
