import AdminsTable from "./components/AdminsTable.jsx";

const ManageAdmins = () => {
  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5">
      <div className="col-span-1 h-fit w-full">
        <AdminsTable />
      </div>
    </div>
  );
};

export default ManageAdmins;