"use client";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type React from "react";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Send, Minus, Plus, ShoppingCart,} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useUser } from "@/context/UserProvider";
import Link from "next/link";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface NewReview {
  name: string;
  comment: string;
  rating: number;
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Absolutely stunning saree! The quality of the silk is exceptional, and the zari work is intricate and beautiful. Perfect for my daughter's wedding.",
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 4,
    date: "1 month ago",
    comment:
      "Beautiful craftsmanship and the color is exactly as shown in the pictures. The only reason for 4 stars is that delivery took a bit longer than expected.",
  },
  {
    id: 3,
    name: "Meera Shah",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    rating: 5,
    date: "2 months ago",
    comment:
      "This saree exceeded my expectations! The border design is exquisite and the fabric drapes beautifully. Received many compliments at the event.",
  },
];

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const { cart, addToCart, wishlist, addToWishlist, removeFromWishlist } = useUser(); // Added cart/wishlist context
  const [product, setProduct] = useState<Product>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState<NewReview>({
    name: "",
    comment: "",
    rating: 5,
  });
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current product
        const productResponse = await fetch(`/api/product/${id}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await productResponse.json();
        setProduct(productData);
        setSelectedImage(productData.images[0]);

        // Fetch all products
        const allProductsResponse = await fetch('/api/product');
        if (!allProductsResponse.ok) {
          throw new Error("Failed to fetch all products");
        }
        const allProductsData = await allProductsResponse.json();
        setAllProducts(allProductsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

    // Function to get similar products
    const getSimilarProducts = () => {
      if (!product || !allProducts.length) return [];
  
      // Get the design number (before the dash)
      const currentDesignNumber = product.id.split('-')[0];
      
      // First try to find products with same design number
      const sameDesignProducts = allProducts.filter(p => 
        p.id !== product.id && 
        p.id.split('-')[0] === currentDesignNumber
      );

     // If no products with same design number, get products from same category
    if (sameDesignProducts.length === 0) {
      return allProducts
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 4);
    }

    return sameDesignProducts.slice(0, 4);
  }; 

  const handleQuantityChange = (type: "increment" | "decrement") => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newReview.name.trim() && newReview.comment.trim()) {
      const review: Review = {
        id: reviews.length + 1,
        ...newReview,
        date: "Just now",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      };
      setReviews([review, ...reviews]);
      setNewReview({ name: "", comment: "", rating: 5 });
    }
  };
  // Updated cart handling
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cart.includes(id)) {
      router.push("/cart");
    } else {
      addToCart(id);
    }
  };

  // Updated wishlist handling
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (wishlist.includes(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF7F3] to-rose-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full h-[60vh] sm:h-[80vh] rounded-xl overflow-hidden bg-white flex items-center justify-center px-4"
            >
              <Zoom>
                <Image
                  src={hoveredImage || selectedImage}
                  alt={product?.name || "Product Image"}
                  width={360}
                  height={500}
                  className="w-full h-full object-contain"
                  priority
                />
              </Zoom>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto sm:overflow-hidden sm:grid sm:grid-cols-4 px-2">
              {product?.images?.map((image, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(image)}
                  onMouseEnter={() => setHoveredImage(image)}
                  onMouseLeave={() => setHoveredImage(null)}
                  className={`w-24 h-24 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    (hoveredImage || selectedImage) === image
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product?.name} ${idx + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-2">
            <div>
              <h1 className="text-3xl lg:text-4xl text-gray-900 font-serif">
                {product?.name}
              </h1>
            </div>

            {/* Reviews Summary */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-5 h-5 ${
                      idx < 4 ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill={idx < 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.0 (128 reviews)</span>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600">
              <p>{product?.description}</p>
            </div>

            {/* Color Selection */}
            {product?.colors && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="flex space-x-3 mt-2">
                  {product.colors.map((color, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded-full ${color} border-2 border-white shadow-md`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center mt-2 border border-gray-300 bg-white rounded-lg w-max p-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange("decrement")}
                >
                  <Minus className="w-5 h-5 text-gray-700" />
                </motion.button>
                <span className="mx-4 text-lg font-semibold">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange("increment")}
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex space-x-4 pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCartClick}
                className="flex-1 bg-[#8B1D3F] text-white px-8 py-4 font-medium hover:bg-[#7a1936] transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{cart.includes(id) ? "View Cart" : "Add to Cart"}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleWishlist}
                className="p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Heart
                  className={`w-6 h-6 transition-colors duration-300 ${
                    wishlist.includes(id) ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Similar Products Section - Move it above reviews */}
        {!loading && product && allProducts.length > 0 && (
          <div className="mt-16 mb-16">
             <h2 className="text-3xl font-serif tracking-wide text-black mb-8">
                  Similar Products
                </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getSimilarProducts().map((similarProduct) => (
                <motion.div
                  key={similarProduct.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative group bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <Link href={`/productpage/${similarProduct.id}`}>
                    <div className="relative">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <Image
                          src={similarProduct.images[0]}
                          alt={similarProduct.name}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (wishlist.includes(similarProduct.id)) {
                            removeFromWishlist(similarProduct.id);
                          } else {
                            addToWishlist(similarProduct.id);
                          }
                        }}
                        className="absolute top-2 left-2 p-2"
                      >
                        <Heart
                        size={24}
                          className={`${
                            wishlist.includes(similarProduct.id)
                              ? "fill-[#fd0202] stroke-[#8b1d1d00]"
                              : "stroke-white"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                        {similarProduct.name}
                      </h3>
                      <p className="text-sm text-gray-500">D.No. {similarProduct.id}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-3xl font-serif tracking-wide text-black mb-8">
            Customer Reviews
          </h2>

          {/* Add Review Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitReview}
            className="bg-white p-6 rounded-lg shadow-sm mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Write a Review
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B1D3F] focus:ring-[#7a1936]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewReview({ ...newReview, rating })}
                      onMouseEnter={() => setHoverRating(rating)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= (hoverRating || newReview.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill={
                          rating <= (hoverRating || newReview.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B1D3F] focus:ring-[#7a1936]"
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8B1D3F] hover:bg-[#7a1936] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </motion.button>
            </div>
          </motion.form>

          {/* Reviews List */}
          <div className="space-y-8">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.name}
                      className="rounded-full object-cover"
                      fill
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {review.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${
                            idx < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill={idx < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;