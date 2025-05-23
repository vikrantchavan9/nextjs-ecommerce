// components/SortFilterControls.jsx
"use client"; // This component MUST be a Client Component

import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react'; // Import Listbox and Transition

export default function SortFilterControls() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get('sortBy') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSection = searchParams.get('section') || '';

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // --- Handlers for Listbox onChange ---
  // Headless UI's Listbox onChange gives you the selected value directly
  const handleSortChange = (value) => {
    router.push(`/shop?${createQueryString('sortBy', value)}`);
  };

  const handleCategoryChange = (value) => {
    router.push(`/shop?${createQueryString('category', value)}`);
  };

  const handleSectionChange = (value) => {
    router.push(`/shop?${createQueryString('section', value)}`);
  };

  // Define your options as an array of objects
  const sortOptions = [
    { value: '', name: 'None' },
    { value: 'price_asc', name: 'Price: Low to High' },
    { value: 'price_desc', name: 'Price: High to Low' },
  ];

  const categoryOptions = [
    { value: '', name: 'All Categories' },
    { value: 't-shirt', name: 'T-Shirt' },
    { value: 'trouser', name: 'Trouser' },
    { value: 'sweater', name: 'Sweater' },
    { value: 'skirt', name: 'Skirt' },
    { value: 'dress', name: 'Dress' },
    { value: 'accessories', name: 'Accessories' },
    { value: 'jacket', name: 'Jacket' },
    // ... add other categories from your products
  ];

  const sectionOptions = [
    { value: '', name: 'All Sections' },
    { value: 'men', name: 'Men' },
    { value: 'women', name: 'Women' },
    { value: 'kids', name: 'Kids' },
    { value: 'unisex', name: 'Unisex' },
  ];


  return (
    // Apply your custom font globally here (e.g., font-sans) or ensure it's inherited from layout.jsx
    <div className="mb-6 flex flex-wrap gap-3 items-center font-sans text-sm">

      {/* Sort By Dropdown */}
      <Listbox value={currentSortBy} onChange={handleSortChange}>
        {({ open }) => ( // 'open' state from Headless UI to control Transition
          <div className="relative">
            <Listbox.Label className="block text-sm font-medium text-gray-700">Sort By:</Listbox.Label>
            <Listbox.Button className="relative w-48 cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 text-sm">
              {/* Display selected value */}
              <span className="block truncate">
                {sortOptions.find(opt => opt.value === currentSortBy)?.name || 'None'}
              </span>
              {/* Arrow icon */}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3z" clipRule="evenodd" />
                </svg>
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-gray-800 text-white' : 'text-gray-900'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        {/* The option text itself is now a span, fully styleable */}
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                            {/* Checkmark icon */}
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.147 1.002l-7.5 10.5a.75.75 0 01-1.172.036l-3.75-3.75a.75.75 0 011.06-1.06l3.19 3.19L15.347 4.3a.75.75 0 011.357-.147z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>

      {/* Repeat similar Listbox structure for Category and Section */}
      {/* Category Dropdown */}
      <Listbox value={currentCategory} onChange={handleCategoryChange}>
         {/* ... (same structure as Sort By) ... */}
        {({ open }) => (
            <div className="relative">
              <Listbox.Label className="block text-sm font-medium text-gray-700">Category:</Listbox.Label>
              <Listbox.Button className="relative w-48 cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 text-sm">
                <span className="block truncate">
                  {categoryOptions.find(opt => opt.value === currentCategory)?.name || 'All Categories'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3z" clipRule="evenodd" /></svg>
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                  {categoryOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-gray-800 text-white' : 'text-gray-900'
                        }`
                      }
                      value={option.value}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.147 1.002l-7.5 10.5a.75.75 0 01-1.172.036l-3.75-3.75a.75.75 0 011.06-1.06l3.19 3.19L15.347 4.3a.75.75 0 011.357-.147z" clipRule="evenodd" /></svg>
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
      </Listbox>

      {/* Section Dropdown */}
      <Listbox value={currentSection} onChange={handleSectionChange}>
        {/* ... (same structure as Sort By) ... */}
        {({ open }) => (
            <div className="relative">
              <Listbox.Label className="block text-sm font-medium text-gray-700">Section:</Listbox.Label>
              <Listbox.Button className="relative w-48 cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 text-sm">
                <span className="block truncate">
                  {sectionOptions.find(opt => opt.value === currentSection)?.name || 'All Sections'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3z" clipRule="evenodd" /></svg>
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                  {sectionOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-gray-800 text-white' : 'text-gray-900'
                        }`
                      }
                      value={option.value}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.147 1.002l-7.5 10.5a.75.75 0 01-1.172.036l-3.75-3.75a.75.75 0 011.06-1.06l3.19 3.19L15.347 4.3a.75.75 0 011.357-.147z" clipRule="evenodd" /></svg>
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
      </Listbox>

    </div>
  );
}