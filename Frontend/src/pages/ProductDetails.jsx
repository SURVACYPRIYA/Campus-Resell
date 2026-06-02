import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import {
  MessageCircle,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  Share2,
  Camera,
  Heart,
  CheckCircle2,
  Edit3,
  Star,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CameraModal from '../components/CameraModal';
import toast from 'react-hot-toast';


const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3e%3crect width='800' height='600' fill='%23f1f5f9'/%3e%3cg transform='translate(360, 260)'%3e%3csvg width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3e%3ccircle cx='8.5' cy='8.5' r='1.5'/%3e%3cpolyline points='21 15 16 10 5 21'/%3e%3c/svg%3e%3c/g%3e%3c/svg%3e";

const ProductDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();
  const [isUploading, setIsUploading] = React.useState(false);

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const fileInputRef = React.useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editBuyer, setEditBuyer] = useState('');
  const [interestedBuyers, setInterestedBuyers] = useState([]);

  const getUserId = (userObj) => {
    if (!userObj) return null;
    return typeof userObj === 'string' ? userObj : (userObj._id || userObj.id);
  };

  const isSeller = user && product && product.seller && String(getUserId(user)) === String(getUserId(product.seller));
  const isBuyer = user && product && product.buyer && String(getUserId(user)) === String(getUserId(product.buyer));

  const [sellerRating, setSellerRating] = useState(null);
  const [ratingInput, setRatingInput] = useState(0);
  const [reviewTextInput, setReviewTextInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [photoToDeleteIndex, setPhotoToDeleteIndex] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleUpdatePhoto = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const res = await axios.patch(
          `/api/products/${product._id}`,
          { images: [...(product.images || []), base64] }
        );
        setProduct(res.data.data.product);
        setShowCamera(false);
        toast.custom((t) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      padding: '14px 22px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      border: `1px solid rgba(239, 68, 68, 0.2)`,
      opacity: t.visible ? 1 : 0,
      transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer'
    }}
    onClick={() => toast.dismiss(t.id)}
  >
    <div style={{
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981, #065f46)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
    }}>
      <CheckCircle2 size={20} color="white" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
      <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
        Photo Updated
      </span>
      <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
        Your photo has been saved.
      </span>
    </div>
  </div>
), { duration: 3000 });
      } catch (err) {
        console.error('Error updating photo:', err);
        toast.custom((t) => (
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              padding: '14px 22px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              opacity: t.visible ? 1 : 0,
              transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              cursor: 'pointer'
            }}
            onClick={() => toast.dismiss(t.id)}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
            }}>
              <AlertTriangle size={20} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
              <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
                Update Failed
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
                Failed to update photo.
              </span>
            </div>
          </div>
        ), { duration: 3000 });
      }
    };
  };

  const handleDeletePhoto = (indexToDelete, e) => {
    e.stopPropagation();
    if (!product.images || product.images.length <= 1) {
      toast.error("You must have at least one photo.");
      return;
    }
    setPhotoToDeleteIndex(indexToDelete);
  };

  const confirmDeletePhoto = async () => {
    if (photoToDeleteIndex === null) return;
    
    try {
      const newImages = product.images.filter((_, idx) => idx !== photoToDeleteIndex);
      const res = await axios.patch(
        `/api/products/${product._id}`,
        { images: newImages }
      );
      setProduct(res.data.data.product);
      if (currentImageIdx === photoToDeleteIndex) {
        setCurrentImageIdx(Math.max(0, photoToDeleteIndex - 1));
      } else if (currentImageIdx > photoToDeleteIndex) {
        setCurrentImageIdx(currentImageIdx - 1);
      }
      toast.custom((t) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      padding: '14px 22px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      border: `1px solid rgba(239, 68, 68, 0.2)`,
      opacity: t.visible ? 1 : 0,
      transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer'
    }}
    onClick={() => toast.dismiss(t.id)}
  >
    <div style={{
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981, #065f46)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
    }}>
      <CheckCircle2 size={20} color="white" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
      <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
        Photo Deleted
      </span>
      <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
        Your photo has been removed.
      </span>
    </div>
  </div>
), { duration: 3000 });
    } catch (err) {
      console.error('Error deleting photo:', err);
      toast.error('Failed to delete photo');
    } finally {
      setPhotoToDeleteIndex(null);
    }
  };

  const handleSetCoverPhoto = async (indexToCover, e) => {
    e.stopPropagation();
    if (indexToCover === 0) return;
    
    try {
      const newImages = [...product.images];
      const selected = newImages.splice(indexToCover, 1)[0];
      newImages.unshift(selected);
      
      const res = await axios.patch(
        `/api/products/${product._id}`,
        { images: newImages }
      );
      setProduct(res.data.data.product);
      setCurrentImageIdx(0);
      toast.custom((t) => (
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            padding: '14px 22px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer'
          }}
          onClick={() => toast.dismiss(t.id)}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
          }}>
            <Star size={20} fill="white" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '170px' }}>
            <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
              Cover Photo Updated
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
              This image is now the main photo.
            </span>
          </div>

          <div style={{
            background: 'rgba(251, 191, 36, 0.15)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            flexShrink: 0
          }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      ), { duration: 4000 });
    } catch (err) {
      console.error('Error setting cover photo:', err);
      toast.error('Failed to set cover photo');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);

        setProduct(res.data.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.seller?._id) {
      axios.get(`/api/users/${product.seller._id}/rating`)
        .then(res => setSellerRating(res.data.data))
        .catch(err => console.error('Failed to fetch seller rating', err));
    }
  }, [product?.seller?._id, product?.rating]);

  // Check wishlist status when product loads
  useEffect(() => {
    if (!product || !user) return;
    const checkWishlist = async () => {
      try {
        const res = await axios.get('/api/users/wishlist');
        const ids = res.data.data.wishlist.map(p => p._id);
        setIsWishlisted(ids.includes(product._id));
      } catch (err) {
        console.error('Failed to check wishlist', err);
      }
    };
    checkWishlist();
  }, [product?._id, user]);

  const handleToggleWishlist = async () => {
    if (!user) return navigate('/login');
    setWishlistLoading(true);
    try {
      const res = await axios.post(`/api/users/wishlist/${product._id}`);
      setIsWishlisted(res.data.isWishlisted);
      toast.success(res.data.isWishlisted ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch (err) {
      console.error(err);
      toast.custom((t) => (
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            padding: '14px 22px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer'
          }}
          onClick={() => toast.dismiss(t.id)}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
              Update Failed
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
              Failed to update wishlist.
            </span>
          </div>
        </div>
      ), { duration: 3000 });
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    if (product && !isEditing) {
      setEditTitle(product.title || '');
      setEditCategory(product.category || 'Others');
      setEditPrice(product.price || '');
      setEditDescription(product.description || '');
      setEditStatus(product.status || 'available');
      setEditBuyer(product.buyer || '');
    }

    if (isEditing && isSeller) {
      const fetchBuyers = async () => {
        try {
          const res = await axios.get(`/api/chats/product/${product._id}/buyers`);
          setInterestedBuyers(res.data.data.buyers || []);
        } catch (err) {
          console.error('Failed to fetch interested buyers', err);
        }
      };
      fetchBuyers();
    }
  }, [product, isEditing, isSeller]);

  const submitReview = async () => {
    if (ratingInput === 0) return toast.error('Please select a star rating');
    setIsSubmittingReview(true);
    try {
      const res = await axios.post(`/api/products/${product._id}/review`, { rating: ratingInput, reviewText: reviewTextInput });
      setProduct(res.data.data.product);
      toast.custom((t) => (
        <div
          style={{
            background: 'linear-gradient(135deg, #451a03, #78350f)',
            padding: '14px 22px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer'
          }}
          onClick={() => toast.dismiss(t.id)}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
          }}>
            <Star size={20} fill="white" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '160px' }}>
            <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
              Review Submitted
            </span>
            <span style={{ color: '#fde68a', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
              Thanks for your feedback!
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: '2px',
            flexShrink: 0
          }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} fill={s <= ratingInput ? '#fbbf24' : 'none'} color={s <= ratingInput ? '#fbbf24' : '#78716c'} />
            ))}
          </div>
        </div>
      ), { duration: 4000 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!editTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    if (!editPrice || Number(editPrice) <= 0) {
      toast.error('Price must be a positive number');
      return;
    }
    if (!editDescription.trim()) {
      toast.error('Description cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const res = await axios.patch(
        `/api/products/${product._id}`,
        {
          title: editTitle,
          category: editCategory,
          price: Number(editPrice),
          description: editDescription,
          status: editStatus,
          buyer: (editStatus === 'sold' && editBuyer) ? editBuyer : null
        }
      );
      setProduct(res.data.data.product);
      setIsEditing(false);
      toast.custom((t) => (
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b, #065f46)',
            padding: '14px 22px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer'
          }}
          onClick={() => toast.dismiss(t.id)}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle2 size={20} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '160px' }}>
            <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
              Update Successful
            </span>
            <span style={{ color: '#a7f3d0', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
              Your changes are saved!
            </span>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399',
            flexShrink: 0
          }}>
            <Edit3 size={22} />
          </div>
        </div>
      ), { duration: 4000 });
    } catch (err) {
      console.error('Error saving product changes:', err);
      toast.error(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleChat = async () => {
    if (!user) return navigate('/login');

    try {
      const res = await axios.post(
        '/api/chats',
        {
          sellerId: product.seller._id,
          productId: product._id
        }
      );

      navigate('/chat', {
        state: {
          activeChatId: res.data.data.chat._id
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = () => {
    if (!user) return navigate('/login');
    setReportReason('');
    setShowReportModal(true);
  };

  const confirmReport = async () => {
    if (!reportReason.trim()) return;
    setIsSubmittingReport(true);
    try {
      await axios.post(
        '/api/reports',
        {
          reportedProductId: product._id,
          reportedUserId: product.seller._id,
          reason: reportReason
        }
      );
      toast.custom((t) => (
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            padding: '14px 22px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer'
          }}
          onClick={() => toast.dismiss(t.id)}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
          }}>
            <AlertTriangle size={20} color="white" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
              Report Submitted
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.title}
            </span>
          </div>
        </div>
      ), { duration: 3000 });
    } catch (err) {
      console.error(err);
      toast.custom((t) => (
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            padding: '14px 22px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer'
          }}
          onClick={() => toast.dismiss(t.id)}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
              Submission Failed
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
              Failed to submit report.
            </span>
          </div>
        </div>
      ), { duration: 3000 });
    } finally {
      setIsSubmittingReport(false);
      setShowReportModal(false);
      setReportReason('');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on Campus Resell!`,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '100px'
        }}
      >
        <Loader2
          className="animate-spin"
          size={48}
          color="var(--primary)"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '100px'
        }}
      >
        Product not found.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* PHOTO DELETE CONFIRMATION MODAL */}
      {photoToDeleteIndex !== null && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '30px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transform: 'scale(1)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Delete Photo</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Are you sure you want to remove this image from your listing?</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button 
                onClick={() => setPhotoToDeleteIndex(null)}
                style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeletePhoto}
                style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
              >
                Yes, Delete It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT PRODUCT MODAL */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '30px',
            width: '90%',
            maxWidth: '440px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transform: 'scale(1)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Report Product</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Help us keep the marketplace safe.</p>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
              Reason for reporting
            </label>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe why you are reporting this product..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              autoFocus
            />
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                onClick={() => { setShowReportModal(false); setReportReason(''); }}
                style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
              >
                Cancel
              </button>
              <button 
                onClick={confirmReport}
                disabled={!reportReason.trim() || isSubmittingReport}
                style={{ 
                  padding: '10px 20px', 
                  background: !reportReason.trim() ? '#cbd5e1' : '#f59e0b', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontWeight: '600', 
                  cursor: !reportReason.trim() ? 'not-allowed' : 'pointer', 
                  transition: 'background 0.2s',
                  opacity: isSubmittingReport ? 0.7 : 1
                }}
                onMouseEnter={e => { if (reportReason.trim()) e.currentTarget.style.background = '#d97706'; }}
                onMouseLeave={e => { if (reportReason.trim()) e.currentTarget.style.background = '#f59e0b'; }}
              >
                {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'color 0.2s',
          fontSize: '0.95rem',
          fontWeight: '600'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={20} />
        Back to Marketplace
      </button>

      {/* MAIN CARD */}
      <div
        className="glass-card"
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(350px, 1fr))',
          overflow: 'hidden'
        }}
      >
        {/* PRODUCT IMAGE */}
        <div
          style={{
            position: 'relative',
            background: '#f1f5f9',
            height: '100%',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {isSeller && (
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowCamera(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <Camera size={16} style={{ marginRight: '6px' }} />
                Capture
              </button>
              <button onClick={() => fileInputRef.current.click()} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#333' }}>
                Upload
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => { if (e.target.files[0]) handleUpdatePhoto(e.target.files[0]) }} />
            </div>
          )}
          <img
            src={product.images[currentImageIdx] || fallbackImage}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '20px'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />

          {/* THUMBNAIL GALLERY */}
          {product.images && product.images.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              padding: '0 20px'
            }}>
              {product.images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setCurrentImageIdx(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: currentImageIdx === idx ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.8)',
                      cursor: 'pointer',
                      padding: 0,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s, border-color 0.2s',
                      transform: currentImageIdx === idx ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => { if (currentImageIdx !== idx) e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={(e) => { if (currentImageIdx !== idx) e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                  {isSeller && (
                    <>
                      {idx === 0 ? (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#fbbf24',
                            color: '#fff',
                            fontSize: '0.6rem',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            zIndex: 10,
                            pointerEvents: 'none'
                          }}
                        >
                          Cover
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleSetCoverPhoto(idx, e)}
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            left: '-6px',
                            background: '#fbbf24',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                            zIndex: 10
                          }}
                          title="Set as Cover Photo"
                        >
                          <Star size={12} fill="white" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeletePhoto(idx, e)}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                          zIndex: 10
                        }}
                        title="Delete Photo"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT DETAILS */}
        <div
          style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* TITLE + REPORT */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}
          >
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="input-glass"
                      style={{ padding: '8px 12px', fontSize: '0.9rem', height: '40px' }}
                    >
                      <option value="Books">Books</option>
                      <option value="Cycles">Cycles</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="input-glass"
                      style={{ padding: '8px 12px', fontSize: '0.9rem', height: '40px' }}
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                  {editStatus?.toLowerCase() === 'sold' && (
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Buyer (Optional)</label>
                      <select
                        value={editBuyer}
                        onChange={(e) => setEditBuyer(e.target.value)}
                        className="input-glass"
                        style={{ padding: '8px 12px', fontSize: '0.9rem', height: '40px' }}
                      >
                        <option value="">Select a buyer</option>
                        {interestedBuyers.map(b => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}
                  >
                    {product.category}
                  </span>
                  <span
                    style={{
                      background: product.status === 'sold' ? '#ef4444' : '#16a34a',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}
                  >
                    {product.status || 'available'}
                  </span>
                </div>
              )}

              {isEditing ? (
                <div style={{ marginTop: '10px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input-glass"
                    style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '8px 12px' }}
                  />
                </div>
              ) : (
                <h1
                  style={{
                    fontSize: '2.5rem',
                    marginTop: '10px',
                    marginBottom: '5px'
                  }}
                >
                  {product.title}
                </h1>
              )}
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                Posted on {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {/* Wishlist Heart */}
              {!isSeller && (
                <button
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  style={{
                    background: isWishlisted ? 'rgba(239,68,68,0.08)' : 'transparent',
                    border: isWishlisted ? '1.5px solid rgba(239,68,68,0.3)' : 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isWishlisted ? '#ef4444' : 'var(--text-muted)',
                    cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Heart size={22} fill={isWishlisted ? '#ef4444' : 'none'} />
                </button>
              )}

              <button
                onClick={handleShare}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                title="Share Product"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.1)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                <Share2 size={24} />
              </button>

              {!isSeller && (
                <button
                  onClick={handleReport}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  title="Report Product"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.1)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <ShieldAlert size={24} />
                </button>
              )}
            </div>
          </div>

          {/* PRICE */}
          {isEditing ? (
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Price (₹)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="input-glass"
                style={{ fontSize: '1.25rem', fontWeight: 'bold', padding: '8px 12px', color: '#16a34a' }}
              />
            </div>
          ) : (
            <h2
              style={{
                fontSize: '2rem',
                color: '#16a34a',
                marginBottom: '30px'
              }}
            >
              ₹{Number(product.price).toLocaleString("en-IN")}
            </h2>
          )}

          {/* DESCRIPTION */}
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '30px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-glass"
                style={{ flex: 1, minHeight: '150px', resize: 'vertical', lineHeight: '1.6', padding: '12px' }}
              />
            </div>
          ) : (
            <p
              style={{
                color: 'var(--text-muted)',
                lineHeight: '1.6',
                marginBottom: '40px',
                flex: 1
              }}
            >
              {product.description}
            </p>
          )}

          {/* SELLER CARD */}
          <div
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '40px',
              background: '#f8fafc',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px'
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', border: '2px solid var(--primary)', background: 'linear-gradient(135deg, var(--primary), #8b1a25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', userSelect: 'none' }}>{product.seller.name?.charAt(0)?.toUpperCase() || '?'}</span>
            </div>

            <div>
              <h4
                style={{
                  marginBottom: '4px'
                }}
              >
                {product.seller.name}
              </h4>

              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}
              >
                Student Seller
              </p>
              {sellerRating && sellerRating.totalRatings > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 'bold', marginTop: '4px' }}>
                  ⭐ {sellerRating.averageRating} ({sellerRating.totalRatings} ratings)
                </div>
              )}
            </div>
          </div>

          {/* BUYER REVIEW SECTION */}
          {isBuyer && product.status === 'sold' && (
            <div style={{ marginBottom: '40px', padding: '20px', background: 'rgba(245,158,11,0.05)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)' }}>
              <h4 style={{ marginBottom: '10px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⭐ Rate Seller
              </h4>
              {product.rating ? (
                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} style={{ color: star <= product.rating ? '#f59e0b' : '#cbd5e1', fontSize: '1.2rem' }}>★</span>
                    ))}
                  </div>
                  {product.reviewText && <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic' }}>"{product.reviewText}"</p>}
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>You have rated this seller.</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>How was your experience buying from {product.seller.name}?</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatingInput(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: star <= ratingInput ? '#f59e0b' : '#cbd5e1',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          transition: 'transform 0.1s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Leave an optional review..."
                    value={reviewTextInput}
                    onChange={(e) => setReviewTextInput(e.target.value)}
                    className="input-glass"
                    style={{ width: '100%', minHeight: '80px', padding: '10px', marginBottom: '15px', resize: 'vertical' }}
                  />
                  <button onClick={submitReview} disabled={isSubmittingReview || ratingInput === 0} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SELLER REVIEWS SECTION */}
          {sellerRating && sellerRating.reviews && sellerRating.reviews.length > 0 && (
            <div style={{ marginTop: '20px', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px', color: '#233559' }}>
                Reviews for {product.seller.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {sellerRating.reviews.map(review => (
                  <div key={review._id} style={{ padding: '20px', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b1a25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', userSelect: 'none' }}>
                            {review.buyer?.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#233559' }}>
                            {review.buyer?.name || 'Anonymous'}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Bought: {review.title}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} style={{ color: star <= review.rating ? '#f59e0b' : '#cbd5e1', fontSize: '1rem' }}>★</span>
                        ))}
                      </div>
                    </div>
                    {review.reviewText && (
                      <p style={{ margin: '10px 0 0', fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5' }}>"{review.reviewText}"</p>
                    )}
                    <p style={{ margin: '10px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHAT / CONNECT BUTTON / OWNER EDIT CONTROLS */}
          {isSeller ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={handleSaveChanges}
                    className="btn-primary"
                    style={{ flex: 1, padding: '15px' }}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      flex: 1,
                      padding: '15px',
                      background: 'transparent',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-muted)',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '15px', minWidth: '150px' }}
                  >
                    Edit Listing
                  </button>
                  <div
                    style={{
                      flex: 1.5,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '15px',
                      background: 'rgba(35, 53, 89, 0.05)',
                      color: 'var(--text-muted)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      border: '1px dashed var(--glass-border)',
                      minWidth: '200px'
                    }}
                  >
                    <span>This is your listing</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={product.status === 'sold' && !isBuyer ? undefined : handleChat}
              className={product.status === 'sold' && !isBuyer ? "" : "btn-primary"}
              disabled={product.status === 'sold' && !isBuyer}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                background: product.status === 'sold' && !isBuyer ? '#f1f5f9' : undefined,
                color: product.status === 'sold' && !isBuyer ? '#94a3b8' : undefined,
                border: product.status === 'sold' && !isBuyer ? '1px dashed #cbd5e1' : undefined,
                cursor: product.status === 'sold' && !isBuyer ? 'not-allowed' : 'pointer',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}
            >
              {product.status === 'sold' && !isBuyer ? (
                <>This item has been sold</>
              ) : isBuyer ? (
                <><MessageCircle size={20} /> Message Seller (Purchased)</>
              ) : (
                <><MessageCircle size={20} /> Chat to Buy / Connect</>
              )}
            </button>
          )}
        </div>
      </div>
      {showCamera && (
        <CameraModal
          onCapture={(file) => handleUpdatePhoto(file)}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default ProductDetails;