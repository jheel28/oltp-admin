import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";

const AddBatchForm = ({ onSubmit, onCancel }) => {
  const auth = useContext(AuthContext);
  const [batchName, setBatchName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = batchName.trim();
    if (!trimmed) {
      message.warning("Batch name cannot be empty");
      return;
    }
    if (trimmed.length < 2) {
      message.warning("Batch name must be at least 2 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/create/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({ batchName: trimmed }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        message.error(responseData.message || "Failed to create batch");
        return;
      }

      message.success("Batch created successfully");
      setBatchName("");
      onSubmit(responseData);
    } catch (error) {
      message.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="text-black rounded-lg p-6 dark:bg-navy-700">
      <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
        Add Batch
      </h2>
      <input
        type="text"
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Batch & Section (e.g., 2026-CSE-A)"
        className="text-black mb-4 w-full rounded-md border border-gray-300 
             bg-white p-3 
             dark:bg-navy-700 dark:text-white"
        disabled={loading}
      />
      <div className="flex space-x-4">
        <button
          className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
        <button
          className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddBatchForm;
