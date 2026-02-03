import React, { useState } from "react";

const EditHomePage = () => {
  const [mainHeading, setMainHeading] = useState("");
  const [sideHeading, setSideHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [iframeUrl] = useState(
    `${process.env.REACT_APP_BACKEND_URL}/superadmin/default`
  ); // Replace with your fixed URL

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to send form data to the server or update iframe content
    console.log("Form submitted:", { mainHeading, sideHeading, paragraph });
  };

  return (
    <div className="mb-4 flex h-screen">
      {/* Left half - Form */}
      <div className="w-1/2 p-4">
        <h2 className="mb-4 text-2xl font-bold">Content Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="mainHeading"
              className="block text-sm font-medium text-gray-600"
            >
              Main Heading:
            </label>
            <input
              type="text"
              id="mainHeading"
              value={mainHeading}
              onChange={(e) => setMainHeading(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-300 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="sideHeading"
              className="block text-sm font-medium text-gray-600"
            >
              Side Heading:
            </label>
            <input
              type="text"
              id="sideHeading"
              value={sideHeading}
              onChange={(e) => setSideHeading(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-300 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="paragraph"
              className="block text-sm font-medium text-gray-600"
            >
              Paragraph:
            </label>
            <textarea
              id="paragraph"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-300 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right half - Iframe */}
      <div className="w-1/2 p-4">
        <h2 className="mb-4 text-2xl font-bold">Page</h2>
        <iframe
          src={iframeUrl}
          title="Preview"
          className="h-full w-full border border-gray-300"
        ></iframe>
      </div>
    </div>
  );
};

export default EditHomePage;
