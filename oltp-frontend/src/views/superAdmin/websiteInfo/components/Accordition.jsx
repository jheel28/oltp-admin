// WebAccordion.jsx
import Card from "components/card";
import { FaChevronDown } from "react-icons/fa";
import React, { useState } from "react";
import EditHomePage from "./EditHomePage";
import EditAboutusPage from "./EditAboutusPage";
import EditContactUsPage from "./EditContactUsPage";

const accordionSections = [
  {
    id: "section1",
    title: "Edit Home Page",
    component: <EditHomePage />,
  },
  {
    id: "section2",
    title: "Edit About Us Page",
    component: <EditAboutusPage />,
  },
  {
    id: "section3",
    title: "Edit Contact Us Page",
    component: <EditContactUsPage />,
  },
];

const WebAccordion = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <Card extra="w-full pb-10 p-4 h-full bg-white dark:bg-gray-800">
      <div id="accordion-color" data-accordion="collapse">
        {accordionSections.map((section) => (
          <div key={section.id} id={`accordion-color-heading-${section.id}`}>
            <button
              type="button"
              className={`bg-gray-100 dark:bg-gray-700 p-5 w-full text-left cursor-pointer rounded-md${
                activeSection === section.id ? "bg-gray-200 dark:bg-navy-600 rounded" : ""
              }`}
              onClick={() => handleSectionClick(section.id)}
              aria-expanded={activeSection === section.id ? "true" : "false"}
              aria-controls={`accordion-color-body-${section.id}`}
            >
              <span className="text-gray-800 dark:text-white">{section.title}</span>
              <FaChevronDown
                className={`w-4 h-4 ml-auto transform ${
                  activeSection === section.id ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={`accordion-color-body-${section.id}`}
              className={`${
                activeSection === section.id ? "block" : "hidden"
              }`}
              aria-labelledby={`accordion-color-heading-${section.id}`}
            >
              {section.component}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WebAccordion;
