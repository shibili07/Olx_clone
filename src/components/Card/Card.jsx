import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../Context/Auth';
import { addToWishlist, fireStore } from '../Firebase/Firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Card({ items }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch user wishlist
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!user) return;

      const q = query(collection(fireStore, 'Wishlist'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const wishlistIds = querySnapshot.docs.map((doc) => doc.data().item.id);
      setWishlistItems(wishlistIds);
    };

    fetchWishlistItems();
  }, [user]);

  const handleWishlistToggle = async (e, item) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to manage wishlist', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }

    const isInList = wishlistItems.includes(item.id);

    if (isInList) {
      const q = query(
        collection(fireStore, 'Wishlist'),
        where('userId', '==', user.uid),
        where('item.id', '==', item.id)
      );
      const querySnapshot = await getDocs(q);
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(doc(fireStore, 'Wishlist', docToDelete.id));
      setWishlistItems((prev) => prev.filter((id) => id !== item.id));
      toast.success('Removed from wishlist', { icon: '💔' });
    } else {
      const result = await addToWishlist(user.uid, item);
      if (result.success) {
        setWishlistItems((prev) => [...prev, item.id]);
        toast.success('Added to wishlist', { icon: '❤️' });
      }
    }
  };

  const isInWishlist = (itemId) => wishlistItems.includes(itemId);

  return (
    <div className="p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen">
      <ToastContainer />
      <h1 style={{ color: '#002f34' }} className="text-2xl">
        Fresh Recommendations
      </h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-5">
        {items.map((item) => (
          <Link to="/details" state={{ item }} key={item.id}>
            <div
              style={{ borderWidth: '1px', borderColor: 'lightgrey' }}
              className="relative w-full h-72 rounded-md border-solid bg-gray-50 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-full flex justify-center p-2 overflow-hidden">
                <img
                  className="h-36 object-contain"
                  src={item.imageUrl || 'https://via.placeholder.com/1500'}
                  alt={item.title}
                />
              </div>

              <div className="details p-1 pl-4 pr-4">
                <h1 style={{ color: '#002f34' }} className="font-bold text-xl">
                  ₹{item.price}
                </h1>
                <p className="text-sm pt-2 text-gray-600">{item.category}</p>
                <p className="pt-2 text-gray-800">{item.title}</p>

                <div
                  className="absolute flex justify-center items-center p-2 bg-white rounded-full top-3 right-3 cursor-pointer hover:scale-110 transition-transform"
                  onClick={(e) => handleWishlistToggle(e, item)}
                >
                  {isInWishlist(item.id) ? (
                    <Heart className="w-5 h-5" fill="#FF4242" stroke="#FF4242" />
                  ) : (
                    <Heart className="w-5 h-5 text-gray-700" />
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Card;
