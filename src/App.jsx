import React, { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';
import { Badge } from 'flowbite-react';
import { motion } from 'framer-motion';

// Api URL
const API_BASE_URL = 'https://admin.refabry.com/api/all/product/get';

//image URL
const getImageUrl = (imageName) => {
    return `https://admin.refabry.com/storage/product/${imageName}`;
};

// For conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Skeleton for Placeholder
const Skeleton = ({ className, ...props }) => (
    <div className={cn("animate-pulse bg-gray-300 dark:bg-gray-700 rounded", className)} {...props}>
        <div className="h-full w-full opacity-0">.</div>
    </div>
);

const ProductCard = ({ product }) => {
    const imageUrl = getImageUrl(product.image);

    return (
        <motion.div
            className='text-white'
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <Card
                className={cn(
                    "overflow-hidden border-0 shadow-lg",
                    "transition-all duration-300",
                    "hover:shadow-xl hover:border-gray-200/50",
                    "group"
                )}
            >
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.stock <= 5 && (
                        <Badge color="failure" className="absolute top-2 left-2  border-none shadow-md">
                            Low Stock ({product.stock})
                        </Badge>
                    )}
                </div>
                <Card>
                    <h1 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
                        {product.name}
                    </h1>
                </Card>
                <Card className="space-y-2">
                    <p className="text-sm text-gray-500 line-clamp-3">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-400">
                            ${product.price.toFixed(2)}
                        </span>
                        <Badge color="outline" className="text-xs  text-gray-600">
                            {product.category.name}
                        </Badge>
                    </div>
                </Card>
            </Card>
        </motion.div>
    );
};

const LoadingSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <Card key={i} className="border-0">
                    <Skeleton className="w-full h-48 rounded-t-lg" />
                    <Card>
                        <Skeleton className="h-6 w-2/3" />
                    </Card>
                    <Card className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-6 w-1/4" />
                        </div>
                    </Card>
                </Card>
            ))}
        </div>
    )
}

const ProductListingWebsite = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(API_BASE_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data && data.data) {
                    setProducts(data.data.data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Loading Products...</h1>
                <LoadingSkeleton />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <div>
            <ProductListingWebsite />
        </div>
    );
};

export default App;
