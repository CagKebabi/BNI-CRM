import { useState, useEffect } from "react";

export default function DarkmodeSwitchBtn() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const enableDarkmode = () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkmode", "active");
  };

  const disableDarkmode = () => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("darkmode", null);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkmode");
    if (savedTheme === "active") {
      setIsDarkMode(true);
      enableDarkmode();
    } else {
      setIsDarkMode(false);
      disableDarkmode();
    }
  }, []);

  const handleThemeSwitch = () => {
    if (!isDarkMode) {
      enableDarkmode();
      setIsDarkMode(true);
    } else {
      disableDarkmode();
      setIsDarkMode(false);
    }
  };

  return (
    // <div className="flex flex-1 items-center space-x-2  justify-end">
      <button
        onClick={handleThemeSwitch}
        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {isDarkMode ? (
          <svg
            className="h-5 w-5 text-gray-800 dark:text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="#000" strokeWidth="2">
              <circle cx="12" cy="12" r="4" strokeLinejoin="round"></circle>
              <path
                strokeLinecap="round"
                d="M20 12h1M3 12h1m8 8v1m0-18v1m5.657 13.657l.707.707M5.636 5.636l.707.707m0 11.314l-.707.707M18.364 5.636l-.707.707"
              ></path>
            </g>
          </svg>
        )}
      </button>
    // </div>
  );
}
