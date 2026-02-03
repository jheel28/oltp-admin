import React, { useState } from "react";

const EditContactUsPage = () => {
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [iframeUrl] = useState("https://example.com"); // Replace with your fixed URL

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to send form data to the server or update iframe content
    console.log("Form submitted:", { heading, paragraph });
  };

  return (
    <div className="flex h-screen">
      {/* Left half - Form */}
      <div className="w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Contact Us Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="heading" className="block text-sm font-medium text-gray-600">
              Heading:
            </label>
            <input
              type="text"
              id="heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="paragraph" className="block text-sm font-medium text-gray-600">
              Paragraph:
            </label>
            <textarea
              id="paragraph"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right half - Iframe */}
      <div className="w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Page</h2>
        <iframe
          src={iframeUrl}
          title="Preview"
          className="w-full h-full border border-gray-300"
        ></iframe>
      </div>
    </div>
  );
};

export default EditContactUsPage;
