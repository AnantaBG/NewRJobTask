/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput } from 'flowbite-react';
import { motion } from 'framer-motion';

// Api base and order URL
const API_BASE_URL = 'https://admin.refabry.com/api/all/product/get';
const ORDER_API_URL = 'https://admin.refabry.com/api/public/order/create';

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

const ProductCard = ({ product, onProductClick }) => {
    const imageUrl = getImageUrl(product.image);

    return (
        <motion.div
            className='text-white cursor-pointer'
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => onProductClick(product)}
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
                        {product.short_desc}
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
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);
    const [orderError, setOrderError] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const deliveryCharge = 80;

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

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);

            return () => clearTimeout(timer); 
        }
    }, [successMessage]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
        setIsOrderModalOpen(false);
        setOrderStatus(null);
        setOrderError(null);
        setOrderQuantity(1);
        setCustomerPhone('');
        setCustomerAddress('');
        setSuccessMessage('');
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setSelectedProduct(null);
    };

    const openOrderModal = () => {
        setIsProductModalOpen(false); 
        setIsOrderModalOpen(true);
    };

    const closeOrderModal = () => {
        setIsOrderModalOpen(false);
        setOrderStatus(null);
        setOrderError(null);
        setSuccessMessage('');
    };

    const handlePlaceOrder = async () => {
        if (selectedProduct && customerPhone && customerAddress && orderQuantity > 0) {
            const calculatedCodAmount = (selectedProduct.price * orderQuantity) + deliveryCharge;

            const orderData = {
                product_ids: selectedProduct.id.toString(),
                s_product_qty: orderQuantity.toString(),
                c_phone: customerPhone,
                c_name: "Guest", 
                courier: "steadfast",
                address: customerAddress,
                advance: null,
                cod_amount: calculatedCodAmount.toFixed(2),
                discount_amount: selectedProduct.discount_amount ? (parseFloat(selectedProduct.discount_amount) * orderQuantity).toFixed(2) : null,
                delivery_charge: deliveryCharge.toString(),
            };

            try {
                const response = await fetch(ORDER_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                const responseData = await response.json();

                if (responseData.status) {
                    setOrderStatus(responseData.message);
                    setOrderError(null);
                    setIsOrderModalOpen(false);
                    setSuccessMessage(`Successfully ordered: ${selectedProduct.name}`);
                    setOrderQuantity(1);
                    setCustomerPhone('');
                    setCustomerAddress('');
                } else {
                    setOrderError(responseData.message || 'Failed to place order.');
                    setOrderStatus(null);
                    setSuccessMessage('');
                }
            } catch (error) {
                setOrderError('An error occurred while placing the order.');
                setOrderStatus(null);
                setSuccessMessage('');
            }
        } else {
            setOrderError('Please enter your phone number, address, and a valid quantity.');
            setOrderStatus(null);
            setSuccessMessage('');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Products</h1>
            {successMessage && (
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    {successMessage}
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
                ))}
            </div>

            {selectedProduct && (
                <>
                    <Modal
                        show={isProductModalOpen}
                        size="md"
                        onClose={closeProductModal}
                    >
                        <ModalHeader className="rounded-t-lg bg-white dark:bg-gray-800">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {selectedProduct.name}
                            </h2>
                        </ModalHeader>
                        <ModalBody className="bg-white dark:bg-gray-800">
                            <div className="flex flex-col space-y-4">
                                <img
                                    src={getImageUrl(selectedProduct.image)}
                                    alt={selectedProduct.name}
                                    className="w-full rounded-md shadow-md"
                                />
                                <div className="py-4 px-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        ${selectedProduct.price.toFixed(2)}
                                        <Badge color="gray" className="ml-2">
                                            {selectedProduct.category.name}
                                        </Badge>
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Stock: {selectedProduct.stock}
                                    </p>
                                </div>
                                <div className="py-4 px-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
                                        {selectedProduct.short_desc}
                                    </p>
                                </div>
                                {selectedProduct.additional_info && (
                                    <div className="py-4 px-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Additional Information</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
                                            {selectedProduct.additional_info}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter className="bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                            <button
                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onClick={closeProductModal}
                            >
                                Close
                            </button>
                            <button
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={openOrderModal}
                            >
                                Place Order
                            </button>
                        </ModalFooter>
                    </Modal>

                    <Modal
                        show={isOrderModalOpen}
                        size="md"
                        onClose={closeOrderModal}
                    >
                        <ModalHeader className="rounded-t-lg bg-white dark:bg-gray-800">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Order Details
                                </h2>
                                <div className="text-gray-600 dark:text-gray-400">
                                    {selectedProduct.name} - ${selectedProduct.price.toFixed(2)}
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody className="bg-white dark:bg-gray-800">
                            <div className="flex flex-col space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity" value="Quantity" />
                                    <TextInput
                                        id="quantity"
                                        type="number"
                                        value={orderQuantity}
                                        onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                                        min="1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" value="Phone Number" />
                                    <TextInput
                                        id="phone"
                                        type="tel"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="01xxxxxxxxx"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address" value="Delivery Address" />
                                    <TextInput
                                        id="address"
                                        type="text"
                                        value={customerAddress}
                                        onChange={(e) => setCustomerAddress(e.target.value)}
                                        placeholder="Your full address"
                                        required
                                    />
                                </div>

                                <div className="py-4 px-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Total Amount: ${((selectedProduct.price * orderQuantity) + deliveryCharge).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Delivery Charge: ${deliveryCharge.toFixed(2)}
                                    </p>
                                </div>

                                {orderError && (
                                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                        {orderError}
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter className="bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                            <button
                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onClick={closeOrderModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={handlePlaceOrder}
                            >
                                Confirm Order
                            </button>
                        </ModalFooter>
                    </Modal>
                </>
            )}
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