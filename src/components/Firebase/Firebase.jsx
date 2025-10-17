import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, addDoc, getDocs, getFirestore, deleteDoc, doc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1ul5jukjC6CB7rifrz82FRn85eTzECek",
  authDomain: "olx-clone-4a036.firebaseapp.com",
  projectId: "olx-clone-4a036",
  storageBucket: "olx-clone-4a036.appspot.com",
  messagingSenderId: "576924852413",
  appId: "1:576924852413:web:e2becb3e5d92702b3d97d4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const fireStore = getFirestore(app);

const fetchFromFireStore = async () => {
  try {
    const productsCollection = collection(fireStore, "Products");
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetching products from FireStore", productList);
    return productList;
  } catch (error) {
    console.error("Error fetching products from FireStore: ", error);
    return [];
  }
};

const fetchUserItems = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const productsRef = collection(fireStore, "Products");
    const userQuery = query(productsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userQuery);

    const userItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Fetched ${userItems.length} items for user: ${userId}`);
    return userItems;
  } catch (error) {
    console.error("Error fetching user items: ", error);
    return [];
  }
};

const deleteItem = async (itemId) => {
  try {
    if (!itemId) throw new Error("Item ID is required");
    
    const docRef = doc(fireStore, "Products", itemId);
    await deleteDoc(docRef);
    
    console.log(`Successfully deleted item: ${itemId}`);
    return { success: true, message: "Item deleted successfully" };
  } catch (error) {
    console.error("Error deleting item: ", error);
    return { success: false, message: error.message };
  }
};

const addToWishlist = async (userId, item) => {
  try {
    const wishlistRef = collection(fireStore, 'Wishlist');
    const q = query(wishlistRef, 
      where('userId', '==', userId),
      where('itemId', '==', item.id)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      await addDoc(wishlistRef, {
        userId,
        itemId: item.id,
        item,
        createdAt: new Date()
      });
      return { success: true, message: 'Added to wishlist' };
    }
    return { success: false, message: 'Already in wishlist' };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, message: error.message };
  }
};

const getWishlistItems = async (userId) => {
  try {
    const wishlistRef = collection(fireStore, 'Wishlist');
    const q = query(wishlistRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      wishlistId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, message: error.message };
  }
};

export { 
  auth, 
  provider, 
  storage, 
  fireStore, 
  fetchFromFireStore, 
  fetchUserItems, 
  deleteItem, 
  addToWishlist, 
  getWishlistItems,
  handleLogout 
};