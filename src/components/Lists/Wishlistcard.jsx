import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteDoc, doc, collection, getDocs } from 'firebase/firestore';
import { fireStore } from '../Firebase/Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Wishlistcard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireStore, 'Wishlist'));
        const wishlistItems = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            docId: docSnap.id, // Store the Firestore document ID
            ...data.item,
            createdAt: data.createdAt,
          };
        });
        setItems(wishlistItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist items');
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleDelete = async (docId) => {
    if (!docId) {
      console.error('No document ID provided');
      return;
    }

    setDeleteStatus({ loading: true, error: null });
    try {
      await deleteDoc(doc(fireStore, 'Wishlist', docId));
      setItems((prev) => prev.filter((item) => item.docId !== docId));
      
      toast.success('Item removed from wishlist 🗑️', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      setDeleteStatus({
        loading: false,
        error: 'Failed to delete item. Please try again.',
      });
      toast.error('Failed to remove item from wishlist', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setDeleteStatus({ loading: false, error: null });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading wishlist items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">WISHLIST</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.docId}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
              >
                <button
                  onClick={() => handleDelete(item.docId)}
                  disabled={deleteStatus.loading}
                  className="absolute right-2 top-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2
                    className={`w-5 h-5 ${
                      deleteStatus.loading ? 'text-gray-400' : 'text-red-500'
                    }`}
                  />
                </button>

                <Link to="/details" state={{ item }}>
                  <div className="p-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 mt-2">
                      ₹ {item.price}
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </Link>
              </div>
            ))}

            {/* Selling Promotion Card */}
            <div className="bg-blue-600 rounded-lg shadow-sm p-6 flex flex-col justify-between text-white">
              <div>
                <h2 className="text-xl font-bold mb-4">Want to see your stuff here?</h2>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Make some extra cash by selling things in your community. Go on, it's
                  quick and easy.
                </p>
              </div>
              <button className="bg-white text-blue-600 font-semibold py-3 px-4 rounded border-2 border-white hover:bg-blue-50 transition-colors mt-6">
                Start selling
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlistcard;
