'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusCircle, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

// UI CHANGE: A skeleton loader for the address list
const AddressSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="w-full h-20 rounded-lg bg-gray-200 dark:bg-slate-700"></div>
    ))}
  </div>
);

// UI CHANGE: Themed alert component
const Alert = ({ message }) => {
  if (!message) return null;
  const isError = message.type === 'error';
  
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg mb-6 text-sm ${
        isError
          ? 'bg-red-500/10 text-red-700 border border-red-500/20'
          : 'bg-green-500/10 text-green-700 border border-green-500/20'
      }`}
    >
      {isError ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
      <span>{message.text}</span>
    </div>
  );
};


export default function AddressManager({ userId }) {
  const supabase = createClientComponentClient();
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address_line: '', city: '', state: '', zip: '', country: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // LOGIC PRESERVED: Your original address fetching logic
  useEffect(() => {
    if (!userId) return;
    const fetchAddresses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        setMessage({ type: 'error', text: 'Failed to load addresses.' });
      } else {
        setAddresses(data || []);
      }
      setLoading(false);
    };

    fetchAddresses();
  }, [userId, supabase]);

  // LOGIC PRESERVED: Your original form and delete handlers
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const addAddress = async (e) => {
    e.preventDefault();
    if (addresses.length >= 3) {
      setMessage({ type: 'error', text: 'You can only have 3 addresses.' });
      return;
    }
    const { data, error } = await supabase
      .from('addresses')
      .insert([{ ...newAddress, user_id: userId }])
      .select();
    if (error) {
      setMessage({ type: 'error', text: 'Failed to add address.' });
    } else {
      setAddresses([...addresses, data[0]]);
      setNewAddress({ address_line: '', city: '', state: '', zip: '', country: '' });
      setMessage({ type: 'success', text: 'Address added successfully!' });
    }
  };

  const deleteAddress = async (id) => {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: 'Failed to delete address.' });
    } else {
      setAddresses(addresses.filter((a) => a.id !== id));
      setMessage({ type: 'success', text: 'Address deleted.' });
    }
  };

  if (loading) return <AddressSkeleton />;

  return (
    // This component is designed to be placed inside an already styled card
    <div className="w-full">
      <Alert message={message} />

      {/* List of addresses */}
      <ul className="space-y-4 mb-8">
        {addresses.map((addr) => (
          <li
            key={addr.id}
            className="p-4 bg-background rounded-lg flex justify-between items-start border border-accent/10"
          >
            <div>
              <p className="font-semibold text-text-primary">{addr.address_line}</p>
              <p className="text-text-muted text-sm">
                {addr.city}, {addr.state}, {addr.zip}, {addr.country}
              </p>
            </div>
            <button
              onClick={() => deleteAddress(addr.id)}
              className="text-text-muted hover:text-red-600 transition-colors flex-shrink-0 ml-4"
              aria-label="Delete address"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </li>
        ))}
        {addresses.length === 0 && <p className="text-text-muted text-center py-4">You have no saved addresses.</p>}
      </ul>

      {/* Add new address form */}
      {addresses.length < 3 && (
        <form onSubmit={addAddress} className="space-y-4">
            <h3 className="font-bold text-lg text-text-primary border-t border-gray-200 pt-6">Add a New Address</h3>
          <input
            type="text" name="address_line" placeholder="Address Line" value={newAddress.address_line} onChange={handleAddressChange} required
            className="block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-white text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleAddressChange}
              className="block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-white text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text" name="state" placeholder="State" value={newAddress.state} onChange={handleAddressChange}
              className="block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-white text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text" name="zip" placeholder="Zip Code" value={newAddress.zip} onChange={handleAddressChange}
              className="block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-white text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text" name="country" placeholder="Country" value={newAddress.country} onChange={handleAddressChange}
              className="block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-white text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-colors rounded-full shadow-lg bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            <PlusCircle className="h-5 w-5" /> Add Address
          </button>
        </form>
      )}
    </div>
  );
}