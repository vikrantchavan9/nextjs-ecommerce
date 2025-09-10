
"use client";
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';

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

  const handleSortChange = (value) => {
    router.push(`/shop?${createQueryString('sortBy', value)}`);
  };

  const handleCategoryChange = (value) => {
    router.push(`/shop?${createQueryString('category', value)}`);
  };

  const handleSectionChange = (value) => {
    router.push(`/shop?${createQueryString('section', value)}`);
  };

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
  ];

  const sectionOptions = [
    { value: '', name: 'All Sections' },
    { value: 'men', name: 'Men' },
    { value: 'women', name: 'Women' },
    { value: 'kids', name: 'Kids' },
    { value: 'unisex', name: 'Unisex' },
  ];

  // Helper function to find the display name
  const findName = (options, value) => options.find(opt => opt.value === value)?.name || options[0].name;

  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <div className="flex flex-wrap items-end gap-3 mb-10">
        
        {/* Sort By Dropdown */}
        <div className="group relative w-52">
          <Listbox value={currentSortBy} onChange={handleSortChange}>
            <Listbox.Label className="block text-sm font-semibold text-gray-700 mb-1">Sort By</Listbox.Label>
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-sm text-gray-900 shadow-sm transition-all duration-200 ease-in-out hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
              <span className="block truncate">{findName(sortOptions, currentSortBy)}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 transition-transform duration-200 group-focus-within:rotate-180">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06L10 13.06l-4.72-4.72a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 transform scale-100"
              leaveTo="opacity-0 transform scale-95"
            >
              <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors duration-150 ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate text-sm ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.name}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.147 1.002l-7.5 10.5a.75.75 0 01-1.172.036l-3.75-3.75a.75.75 0 011.06-1.06l3.19 3.19L15.347 4.3a.75.75 0 011.357-.147z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>

        {/* Category Dropdown */}
        <div className="group relative w-52">
          <Listbox value={currentCategory} onChange={handleCategoryChange}>
            <Listbox.Label className="block text-sm font-semibold text-gray-700 mb-1">Category</Listbox.Label>
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-sm text-gray-900 shadow-sm transition-all duration-200 ease-in-out hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
              <span className="block truncate">{findName(categoryOptions, currentCategory)}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 transition-transform duration-200 group-focus-within:rotate-180">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06L10 13.06l-4.72-4.72a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 transform scale-100"
              leaveTo="opacity-0 transform scale-95"
            >
              <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                {categoryOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors duration-150 ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate text-sm ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.name}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.147 1.002l-7.5 10.5a.75.75 0 01-1.172.036l-3.75-3.75a.75.75 0 011.06-1.06l3.19 3.19L15.347 4.3a.75.75 0 011.357-.147z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>

        {/* Section Dropdown */}
        <div className="group relative w-52">
          <Listbox value={currentSection} onChange={handleSectionChange}>
            <Listbox.Label className="block text-sm font-semibold text-gray-700 mb-1">Section</Listbox.Label>
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-sm text-gray-900 shadow-sm transition-all duration-200 ease-in-out hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
              <span className="block truncate">{findName(sectionOptions, currentSection)}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 transition-transform duration-200 group-focus-within:rotate-180">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06L10 13.06l-4.72-4.72a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 transform scale-100"
              leaveTo="opacity-0 transform scale-95"
            >
              <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                {sectionOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors duration-150 ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate text-sm ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.name}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.147 1.002l-7.5 10.5a.75.75 0 01-1.172.036l-3.75-3.75a.75.75 0 011.06-1.06l3.19 3.19L15.347 4.3a.75.75 0 011.357-.147z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>

      </div>
    </Suspense>
  );
}