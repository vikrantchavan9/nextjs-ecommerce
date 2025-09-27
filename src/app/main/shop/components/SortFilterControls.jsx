"use client";
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react'; // UI CHANGE: Import Lucide icons

// Helper component to keep the code DRY
function ThemedListbox({ label, options, value, onChange }) {
  const findName = (opts, val) => opts.find(opt => opt.value === val)?.name || opts[0].name;

  return (
    <div className="w-full sm:w-52">
      <Listbox value={value} onChange={onChange}>
        <Listbox.Label className="block text-sm font-bold text-text-muted mb-1">{label}</Listbox.Label>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-md shadow-sm py-2 pl-3 pr-10 text-left bg-white  text-text-primary border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent">
            <span className="block truncate">{findName(options, value)}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-5 w-5 text-text-muted" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-accent/10 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-accent/10 text-text-primary' : 'text-text-muted'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium text-text-primary ' : 'font-normal'}`}>
                        {option.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}


export default function SortFilterControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // LOGIC PRESERVED: All your original logic for handling state and URL params
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
    router.push(`/main/shop?${createQueryString('sortBy', value)}`);
  };

  const handleCategoryChange = (value) => {
    router.push(`/main/shop?${createQueryString('category', value)}`);
  };

  const handleSectionChange = (value) => {
    router.push(`/main/shop?${createQueryString('section', value)}`);
  };

  const sortOptions = [
    { value: '', name: 'Default' },
    { value: 'price_asc', name: 'Price: Low to High' },
    { value: 'price_desc', name: 'Price: High to Low' },
  ];

  const categoryOptions = [
    { value: '', name: 'All Categories' },
    { value: 't-shirt', name: 'T-Shirt' },
    { value: 'trouser', name: 'Trouser' },
    { value: 'dress', name: 'Dress' },
    { value: 'skirt', name: 'Skirt' },
    { value: 'top', name: 'Tops' },
  ];

  const sectionOptions = [
    { value: '', name: 'All Sections' },
    { value: 'men', name: 'Men' },
    { value: 'women', name: 'Women' },
    { value: 'unisex', name: 'Unisex' },
    { value: 'kids', name: 'Kids' },
  ];

  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
        <ThemedListbox 
          label="Sort By" 
          options={sortOptions} 
          value={currentSortBy} 
          onChange={handleSortChange} 
        />
        <ThemedListbox 
          label="Category" 
          options={categoryOptions} 
          value={currentCategory} 
          onChange={handleCategoryChange} 
        />
        <ThemedListbox 
          label="Section" 
          options={sectionOptions} 
          value={currentSection} 
          onChange={handleSectionChange} 
        />
      </div>
    </Suspense>
  );
}