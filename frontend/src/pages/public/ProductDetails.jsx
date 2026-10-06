import { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { MdClose, MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp } from 'react-icons/md';
import ProductCard from '../../components/ProductCard';
import placeholderImage from '../../assets/PlaceholderImage.png'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import api from '../../api/axios';
import FadeIn from '../../animations/FadeIn';
import ScrollReveal from '../../animations/ScrollReveal';
import { ProductCardSkeleton, ProductDetailsSkeleton } from '../../components/skeletons';



const ProductDetails = () => {

    const {productId} = useParams()
    const { fetchProductDetails, product, isDetailsLoading, categoryOptions, sleeveOptions, styleOptions, patternOptions, collarOptions, neckOptions } = useProducts();
    
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [isRecommendedLoading , setIsRecommendedLoading ] = useState(true)

    const [selectedImage, setSelectedImage] = useState(null);

    // for to add cart
    const {addToCart, setCartErrors, cartErrors} = useCart();
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    // const [selectedItems, setSelectedItems] = useState([]);

    // const [isExpanded, setIsExpanded] = useState(false);


    // for description,additional info, reviews
    const [activeTab, setActiveTab] = useState('description');

    const scrollRef = useRef(null)
    const verticalScrollRef = useRef(null)
    const horizontalScrollRef = useRef(null)  

    
    useEffect(() => {
        if (productId) {
            fetchProductDetails(productId)
        }
    },[productId])

    // recommended product section
    useEffect(() => {
        const fetchProductRecommendations = async () => {
            try {
                const res = await api.get(`/products/${product.id}/recommendations/`);
                setRecommendedProducts(res.data);
            } catch (error) {
                console.error("Error loading recommendations:", error);
            } finally {
                setIsRecommendedLoading(false)
            }
        };

        if (product?.id) {
            fetchProductRecommendations();
        } else {
            // Clear past recommendations if the product data is wiped out or loading
            setRecommendedProducts([]);
        }
    }, [product?.id]);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(product.images[0]);
        }
    }, [product]);


    if (!product?.images) return;

    const allImages = product.images;
    const thumbnails = allImages.filter(img => img.id !== selectedImage?.id);



    const scrollTop = (direction) => {
        if (verticalScrollRef.current) {
            const { current } = verticalScrollRef;
            const scrollAmount = 272; // Adjust this based on thumbnail width
            if (direction === 'top') {
                current.scrollTop -= scrollAmount;
            } else {
                current.scrollTop += scrollAmount;
            }
        }
    };

    const scrollLeft = (direction) => {
        if (horizontalScrollRef.current) {
            const { current } = horizontalScrollRef;
            const scrollAmount = 272; // Adjust this based on thumbnail width
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };


    const scroll2 = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth 
                : scrollLeft + clientWidth;
            
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
        // if (scrollRef.current) {
        //     const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
        //     const cardWidth = clientWidth; // Adjust if you want to scroll item by item
            
        //     let target = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;

        //     // Infinite Logic: Jump without animation when reaching ends
        //     if (target <= 0) {
        //         // If going left past start, jump to the end of the original set
        //         scrollRef.current.scrollLeft = scrollWidth / 2;
        //         target = (scrollWidth / 2) - cardWidth;
        //     } else if (target >= scrollWidth - clientWidth) {
        //         // If going right past end, jump to the start of the original set
        //         scrollRef.current.scrollLeft = (scrollWidth / 2) - clientWidth;
        //         target = (scrollWidth / 2);
        //     }

        //     scrollRef.current.scrollTo({ left: target, behavior: 'smooth' });
        // }
    };


    
// for cart
    const increaseQuantity = () => setQuantity(prev => prev + 1);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const removeSelection = () => {
        setCartErrors({})
        setSelectedColor(null),
        setSelectedSize(null),
        setQuantity(1)
    }

    // const addSelection = () => {
    //     if (!selectedColor || !selectedSize) return;

    //     setSelectedItems(prev => {
    //         const existing = prev.find(item =>
    //                 item.color.id === selectedColor.id &&
    //                 item.size === selectedSize
    //         );
    //         // for to updates the quantity if the user select same size and color
    //         if (existing) {
    //             return prev.map(item =>
    //                 item.color.id === selectedColor.id &&
    //                 item.size === selectedSize
    //                     ? {
    //                         ...item,
    //                         quantity: item.quantity + quantity
    //                     }
    //                     : item
    //             );
    //         }

    //         return [
    //             ...prev,
    //             {
    //                 color: selectedColor,
    //                 size: selectedSize,
    //                 quantity
    //             }
    //         ];
    //     });
    //     // Reset selection
    //     setSelectedColor(null);
    //     setSelectedSize(null);
    //     setQuantity(1);
    // };

    // const removeSelection = (index) => {
    //     setSelectedItems(prev =>
    //         prev.filter((_, i) => i !== index)
    //     );
    // // };
    
    // const sizeObj = product.sizes.find(
    //     s => s.name === selectedSize
    // );

    

    return (
        <Fragment>
            <div className='flex flex-col min-h-screen'>
                <Header />

                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>Product Details</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / Collections / Product Details </p>
                    </FadeIn>
                </section>

                
                { (isDetailsLoading || product.length < 0 ) ? (
                <ProductDetailsSkeleton />
                ) : (
                    <section className='grow container px-4 md:px-6 lg:px-8 my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 place-self-center'>
                        <FadeIn className='col-span-1 lg:col-span-6'>
                        <div className="overflow-hidden gap-4 flex flex-col ">
                            <div className='grid grid-cols-6 gap-4'>
                                <div className='col-span-1 relative hidden xl:flex flex-col shrink-0 h-140'>
                                    {allImages.length > 4 && 
                                        <MdKeyboardArrowUp 
                                            onClick={() => scrollTop('top')} 
                                            size={30} 
                                            className='absolute top-0 left-1/2 -translate-x-1/2 bg-white text-black rounded-full border z-10 cursor-pointer' />
                                    }
                                    <div ref={verticalScrollRef} className={`flex flex-col grid-rows-5 gap-4 ${allImages.length > 4 && 'my-4'} overflow-y-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden `}>
                                        {allImages.map((img) => (
                                            <img key={img.id} src={img.image} onClick={() => setSelectedImage(img)} 
                                                style={{ width: '120px',height:'120px'}} 
                                                className={`row-span-1 object-cover aspect- cursor-pointer shrink-0 rounded-xl bg-gray-200 ${img.id === selectedImage?.id ? 'border-2 opacity-100' : 'border-2 border-transparent opacity-70'}`}
                                            />
                                        ))}
                                    </div>
                                    {allImages.length > 4 &&
                                        <MdKeyboardArrowDown 
                                            onClick={() => scrollTop('bottom')} 
                                            size={30} 
                                            className={`${allImages.length >=5 ? 'block' : 'hidden'} absolute bottom-0 left-1/2 -translate-x-1/2 bg-white text-black rounded-full border z-10 cursor-pointer`} />
                                    }
                                </div>

                                <img src={selectedImage?.image || placeholderImage}
                                    alt='Selected preview'  
                                    className='col-span-6 xl:col-span-5 w-full aspect-4/5 lg:max-h-140 object-cover bg-linear-to-t from-gray-200 from-60% to-gray-500 rounded-2xl border border-gray-300'/>
                            </div>  

                            <div className='relative flex items-center xl:hidden'>
                                {allImages.length > 4 &&
                                    <MdKeyboardArrowLeft
                                        onClick={() => scrollLeft('left')} 
                                        size={30} 
                                        className={`hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 bg-white text-black rounded-full border z-10 cursor-pointer`} 
                                    />
                                }

                                <div ref={horizontalScrollRef}
                                    className={`flex flex-row gap-2 lg:gap-4 ${allImages.length > 4 && 'lg:mx-4'} overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
                                >
                                    {allImages.map((img) => (
                                        <img key={img.id} src={img.image} onClick={() => setSelectedImage(img)} 
                                            // style={{ width: '120px', height: '120px'}} 
                                            className={`w-20 h-20 sm:w-26 sm:h-26 object-cover cursor-pointer shrink-0 rounded-xl bg-gray-200 
                                                ${img.id === selectedImage?.id ? 'border-2 opacity-100' : 'border-2 border-transparent opacity-70'}`}
                                        />
                                    ))}
                                </div>

                                {allImages.length > 4 &&
                                    <MdKeyboardArrowRight 
                                        onClick={() => scrollLeft('right')} 
                                        size={30} 
                                        className={`hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 bg-white text-black rounded-full border z-10 cursor-pointer`} 
                                    />
                                }
                            </div>
                        </div>
                        </FadeIn>


                        <FadeIn delay={0.2} className='col-span-1 lg:col-span-6' >
                        <div className='flex flex-col h-full'>
                            <h2 className='capitalize font-semibold text-xl lg:text-3xl mb-2'>{ product.name }</h2>
                            <h2 className='flex items-center gap-2'>
                                <span className='font-bold text-lg lg:text-2xl'> ${ product.discount_price || product.price }</span> 
                                <span className='font-semibold text-base lg:text-xl line-through text-gray-500'>${ product.price }</span>
                            </h2>
                            <div className='text-black mt-4 lg:mt-5'>
                                
                                <p className='text-sm lg:text-base line-clamp-3'>{ product.description }</p>
                            </div>
                            <div className='mt-5'>
                                <h2 className='font-semibold lg:text-lg mb-2'>
                                    Select Color : { !selectedColor && cartErrors.color ? 
                                    <span className='font-normal text-red-500 text-sm'>{cartErrors.color} </span> 
                                    : <span className='font-normal text-gray-500 capitalize'>{selectedColor?.name}</span>}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((c, index) => (
                                        <div key={c.id} 
                                            onClick={() => {setSelectedColor(c);
                                                            setCartErrors(prev => ({ ...prev, color: null }));}}
                                            style={{ borderColor: selectedColor?.id === c.id ? c.hex_code : '#D1D5DB' }}
                                            className={`p-1 border rounded-full cursor-pointer transition-all ${selectedColor?.id === c.id ? 'scale-110' : ''}`}>
                                            <div
                                                style={{ backgroundColor: c.hex_code }} 
                                                className='w-5 h-5 rounded-full'
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='mt-5'>
                                <h2 className='font-semibold lg:text-lg mb-2'>
                                    Select Size : {cartErrors.size && !selectedSize ?
                                    <span className='font-normal text-red-500 text-sm'>{cartErrors.size} </span> 
                                    : <span className='font-normal text-gray-500'>{selectedSize}</span>}
                                </h2>
                                <div className='flex text-black gap-4'>
                                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <span key={size} 
                                            // to prevent user from selecting unavailabe size 
                                            onClick={() => {product.sizes.some(s => s.name === size) && setSelectedSize(size);
                                                            setCartErrors(prev => ({ ...prev, size: null }));}}
                                            className={`py-2 rounded-sm text-sm font-semibold w-12 text-center cursor-pointer border border-gray-300 transition-all
                                            ${!product.sizes.some(s => s.name === size) ? 'bg-gray-300 cursor-not-allowed! text-gray-500' : selectedSize === size ? 'btn-primary border-0' : 'bg-white text-black' }`}>
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="my-5">
                                <h2 className="font-semibold lg:text-lg mb-2">Quantity</h2>
                                <div className="flex items-center text-black w-fit bg-gray-100 rounded-full p-1">
                                    <div onClick={decreaseQuantity} className={` ${ quantity <= 1 ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-300'} p-3 border border-gray-300 rounded-full transition`}>
                                        <FiMinus />
                                    </div>
                                    <span className="w-12 text-center font-semibold"> {quantity} </span>
                                    <div onClick={increaseQuantity} className="p-3 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-300 transition">
                                        <FiPlus />
                                    </div>
                                </div>
                            </div>

                            
                            { (selectedSize !== null || selectedColor || quantity > 1) &&
                            <a onClick={removeSelection} className='mb-5 flex items-center gap-1 text-emerald-800 cursor-pointer'>
                                <p className='font-semibold underline'>Clear</p>
                                <MdClose size={16} />  
                            </a>
                            }

                            <div className='flex gap-4 lg:mt-auto'>
                                <button disabled={product.stock === 0}
                                onClick={() => {addToCart({ product: product, color: selectedColor, size: product.sizes.find(s => s.name === selectedSize), quantity: quantity,},removeSelection); }} 
                                className={`w-full py-3! rounded-none! font-semibold ${product.stock === 0 ? 'cursor-not-allowed! bg-gray-300' : 'btn-primary'}`}
                                >
                                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>
                                {/* <button className='w-full py-3! btn-primary rounded-full! font-semibold'>Buy Now</button> */}
                            </div>
                        </div>
                        </FadeIn>

                    </section>
                )}


                {product && (
                    <ScrollReveal>
                    <section className='px-4 md:px-6 lg:px-8 my-8 lg:my-16 container place-self-center space-y-4'>
                        <div className='flex justify-center border-b border-gray-300 gap-[4%]'>
                            <h2 onClick={() => setActiveTab('description')} className={`font-semibold text-base lg:text-2xl cursor-pointer pb-2 text-center ${activeTab === 'description' ? 'border-b-2' : 'text-gray-500!'}`}>Description </h2>
                            <h2 onClick={() => setActiveTab('additional-info')} className={`font-semibold text-base lg:text-2xl cursor-pointer pb-2 text-center ${activeTab === 'additional-info' ? 'border-b-2' : 'text-gray-500!'}`}>Additional Information </h2>
                            <h2 onClick={() => setActiveTab('reviews')} className={`font-semibold text-base lg:text-2xl cursor-pointer pb-2 text-center ${activeTab === 'reviews' ? 'border-b-2' : 'text-gray-500!'}`}>Rating & Reviews </h2>
                        </div>
                        {/* for description */}
                        <div>
                            {activeTab === 'description' && (
                                <FadeIn className='mb'>
                                    <p className='text-sm lg:text-base'>{product.description}</p>
                                </FadeIn>
                                
                            

                            )}
                            {/* for additional info */}
                            {activeTab === 'additional-info' && (
                                <FadeIn>
                                <table className="w-full text-left border-collapse border border-gray-300">
                                    <thead >
                                        <tr className="bg-emerald-800 text-white font-semibold text-base lg:text-lg" >
                                            <th className="py-3 px-4 w-1/3">Feature</th>
                                            <th className="py-3 px-4 w-2/3">Description</th>
                                        </tr>
                                    </thead>

                                    <tbody className='text-black text-sm lg:text-base'  >
                                        <tr className="bg-white">
                                            <td className="py-3 px-4">Category</td>
                                            <td className="py-3 px-4">
                                            {categoryOptions.find(opt => opt.value === product.category)?.label || product.category}
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-300">
                                            <td className="py-3 px-4">Size</td>
                                            <td className="py-3 px-4">
                                            {product.sizes.map((s, index) => (
                                                <span key={s.id}>
                                                    {s.name}
                                                    {index < product.sizes.length - 1 && ', '}
                                                </span>
                                            ))}
                                            </td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="py-3 px-4">Colors</td>
                                            <td className="py-3 px-4">
                                            {product.colors.map((c, i) => (
                                                <span key={c.id} className="capitalize mr-2 last:mr-0">
                                                    {c.name}
                                                    {i < product.colors.length - 1 && ','}
                                                </span>
                                            ))}
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-300">
                                            <td className="py-3 px-4">Prints & Pattern</td>
                                            <td className="py-3 px-4">
                                            {patternOptions.find(opt => opt.value === product.pattern)?.label || product.pattern}
                                            </td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="py-3 px-4">Style</td>
                                            <td className="py-3 px-4">
                                            {styleOptions.find(opt => opt.value === product.style)?.label || product.style}
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-300">
                                            <td className="py-3 px-4">Sleeve Length</td>
                                            <td className="py-3 px-4">
                                            {sleeveOptions.find(opt => opt.value === product.sleeve_type)?.label || product.sleeve_type}
                                            </td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="py-3 px-4">Neck Style</td>
                                            <td className="py-3 px-4">
                                            {(product.category === 'tshirt' ? neckOptions : collarOptions).find(opt => opt.value === product.neck_style)?.label || product.neck_style }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                </FadeIn>
                            )}
                            {/* for reviews */}
                            {activeTab === 'reviews' && (
                                <FadeIn>
                                    ....
                                </FadeIn>
                            )}
                        </div>

                    </section>
                    </ScrollReveal>
                )}
                    
                {( isRecommendedLoading || recommendedProducts.length > 0 ) && (
                    <ScrollReveal>
                    <section className='px-4 md:px-6 lg:px-8 container place-self-center pb-30'>
                        <h2 className='font-semibold text-xl lg:text-3xl text-center my-10 font-serif'>You might also like</h2>
                        <div className='flex justify-between items-center gap-4'>
                            {recommendedProducts.length > 4 && (
                                <button onClick={() => scroll2('left')} className="hidden! lg:block! text-black z-20 p-3! rounded-full!"><IoIosArrowBack size={35} /></button>
                            )}

                            <div ref={scrollRef} className='flex overflow-x-auto lg:overflow-hidden gap-3 lg:gap-6 [&::-webkit-scrollbar]:hidden no-scrollbar'>
                                {isRecommendedLoading ? (
                                    Array.from({ length: 3 }).map((_, idx) => (
                                        <ProductCardSkeleton key={idx} />
                                    ))
                                ) : (
                                    recommendedProducts
                                    // .filter(p => p.id !== product.id)
                                    // // .filter(p => p.id !== product.id && p.category  === product.category)
                                    // .sort(() => 0.5 - Math.random())  // shuffle randomly
                                    // .sort((a, b) => (a.category === product.category ? -1 : 1))
                                    // .slice(0,8)
                                    .map(product=> (
                                        <div key={product.id} className='max-w-56 sm:max-w-none sm:w-auto shrink-0'>
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                )}
                            </div>

                            {recommendedProducts.length > 4 && (
                                <button onClick={() => scroll2('right')} className="hidden! lg:block! text-black z-20 p-3! rounded-full!"><IoIosArrowForward size={35} /></button>
                            )}
                        </div>
                    </section>
                    </ScrollReveal>
                )}
               


                <section>
                    <Footer />
                </section>
            </div>

        </Fragment>

        // scale up animation 
        // you might also like it section with ltd products 
    );
}

export default ProductDetails;
