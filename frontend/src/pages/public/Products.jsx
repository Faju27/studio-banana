import React, { Fragment, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Banner from '../../assets/Collections Banner.jpg'
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { MdClose, MdSearch } from 'react-icons/md';
import Loader from '../../components/Loader';
import { useLocation } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import FadeIn from '../../animations/FadeIn';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';
import { ProductCardSkeleton } from '../../components/skeletons';

const Products = () => {

    const { fetchProductList, categoryOptions, sleeveOptions, styleOptions, patternOptions, collarOptions, neckOptions } = useProducts();
   
    const [products, setProducts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
   
    const [search, setSearch] = useState("");
    const [ordering, setOrdering] = useState('')

    // const [category, setCategory] = useState("");
    // const [style, setStyle] = useState("");

    // const [categories, setCategories] = useState([]);
    const [sleeveTypes, setSleeveTypes] = useState([]);
    const [styles, setStyles] = useState([]);
    // const [patterns, setPatterns] = useState([]);
    const [neckStyles, setNeckStyles] = useState([]);

    const [categories, setCategories] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const val = params.get("category");
        return val ? val.split(",") : [];
    });

    const [patterns, setPatterns] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const val = params.get("pattern");
        return val ? val.split(",") : [];
    });

    // const [newArrival, setNewArrival] = useState(false);

    const [newArrival, setNewArrival] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("is_new_arrival") === "true";
    });
    
    // const [currentUrl, setCurrentUrl] = useState('/products/');

    const [isSortOpen, setIsSortOpen] = useState(false)
    const [asideVisible, setAsideVisible] = useState(false);

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);

    const [allProductsUnfiltered, setAllProductsUnfiltered] = useState([]);

    const location = useLocation();

    useEffect(() => {
        const loadInitialCounts = async () => {
            const data = await fetchProductList('/products/?page_size=1000');

            if (data) {
                const allItems = data.results || data;
                setAllProductsUnfiltered(allItems);
            }
        };
        loadInitialCounts();
    }, []);
    
    const loadProducts = async (url) => {
        if (!url) return;

        const data = await fetchProductList(url);

        if (data) {
            setProducts(data.results);
            setNextPage(data.next);
            setPrevPage(data.previous);
        }
    };

    useEffect(() => {

        setIsFetchingProducts(true)

        const delay = setTimeout(async () => {

            try {
                const params = new URLSearchParams();

                if (search) {
                    params.set("search", search);
                }

                params.set("ordering", ordering);

                if (categories.length) {
                    params.set("category", categories.join(","));
                }
                if (sleeveTypes.length) {
                    params.set("sleeve_type", sleeveTypes.join(","));
                }
                if (styles.length) {
                    params.set("style", styles.join(","));
                }
                if (patterns.length) {
                    params.set("pattern", patterns.join(","));
                }
                if (neckStyles.length) {
                    params.set("neck_style", neckStyles.join(","));
                }

                if (newArrival) {
                    params.set("is_new_arrival", "true");
                }


            // Syncs the web browser URL string dynamically without triggering a hard page refresh
            const nextURLQuery = window.location.pathname + '?' + params.toString();
            window.history.replaceState(null, '', nextURLQuery);

                const url = `/products/?${params.toString()}`;

                await loadProducts(url);

            } catch (error) {
                console.error("Failed to fetch debounced products:", error);
            } finally {
                setIsFetchingProducts(false)
                setIsInitialLoad(false)
            }

        }, 500);

        return () => clearTimeout(delay);

    }, [search, ordering, categories, sleeveTypes, styles, patterns, neckStyles, newArrival]);

    // useEffect(() => {
    //     fetchProductList(currentUrl);
    // }, [currentUrl]);
    


    // to show the new arrival products, from home page see more button
    useEffect(() => {
        if (location.state?.showNewArrivals) {
            setNewArrival(true);
        }
    }, [location.state]);


    // const handleClearFilters = () => {
    //     setCategory('');
    //     setPattern('');
    //     setSleeveType('');
    //     setStyle('');
    //     setNeckStyle('');
    // };
    const handleClearFilters = () => {
        setCategories([]);
        setSleeveTypes([]);
        setStyles([]);
        setPatterns([]);
        setNeckStyles([]);
        setNewArrival(false);
        setSearch("");

        // Wipes out the parameters behind the "?" string in the web address browser line
        window.history.replaceState(null, '', window.location.pathname);

    };

    const handleFilterChange = (value, checked, setFilter) => {
        if (checked) {
            setFilter(prev => [...prev, value]);
        } else {
            setFilter(prev => prev.filter(item => item !== value));
        }
    };

    const activeFilters = [
        ...categories.map(value => ({ value, type: 'list', label: categoryOptions.find(o => o.value === value)?.label || value, set: setCategories })),
        ...styles.map(value => ({ value, type: 'list', label: styleOptions.find(o => o.value === value)?.label || value, set: setStyles })),
        ...patterns.map(value => ({ value, type: 'list', label: patternOptions.find(o => o.value === value)?.label || value, set: setPatterns })),
        ...sleeveTypes.map(value => ({ value, type: 'list', label: sleeveOptions.find(o => o.value === value)?.label || value, set: setSleeveTypes })),
        ...(newArrival ? [{ value: true, type: 'bool', label: 'New Arrival', set: setNewArrival }] : [])
    ];







    return (
        <Fragment>
            <div className='flex flex-col min-h-screen'>
                <Header />


                <section className='lg:px-[5%]'>
                    {/* <h2>All Products</h2>
                    <p>Browse our premium wholesale collection.</p> */}
                    {/* <div className='relative bg-black h-120 sm:h-100 lg:rounded-2xl overflow-hidden collection-banner'>
                        <img src={Banner} className='absolute inset-0 w-full h-full object-right object-cover'/>
                        <div className='absolute z-10 inset-y-0 md:content-center p-8 sm:px-12 sm:w-150 '>
                            <p className='text-black'>- Collections</p>
                            <h2 className='text-white! text-shadow-md text-shadow-black text-3xl lg:text-4xl font-semibold mb-4'>Explore The Various Wholesale Collection</h2>
                            <h2 className='text-white! text-shadow-md md:text-shadow-xs text-shadow-black text-lg lg:text-xl'>Fashion is an instant language. Speak it fluently with our new collection.</h2>
                        </div>
                    </div> */}
                </section>
                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>Collections</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / Collections </p>
                    </FadeIn>
                </section>


                <section className='flex justify-center gap-4 items-center  sticky top-20 z-1 bg-white/10 backdrop-blur-xs'>
                        {/* Category Select */}
                        {/* <select defaultValue='' onChange={(e) => {setCategory(e.target.value); setNeckStyle('')}}>
                            <option value="" disabled hidden>Category</option>
                            <option value="">All Categories</option> 
                            {categoryOptions.map(opt => 
                                <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select> */}

                        {/* Sleeve Select */}
                        {/* <select defaultValue='' onChange={(e) => setSleeveType(e.target.value)}>
                            <option value="" disabled hidden>Sleeve Length</option>
                            <option value="">All Sleeves</option>
                            {sleeveOptions.map(opt => 
                                <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select> */}

                        {/* Style Select */}
                        {/* <select defaultValue='' onChange={(e) => setStyle(e.target.value)}>
                            <option value="" disabled hidden>Style</option>
                            <option value="">All Styles</option>
                            {styleOptions.map(opt => 
                                <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select> */}

                        {/* Pattern Select */}
                        {/* <select defaultValue='' onChange={(e) => setPattern(e.target.value)}>
                            <option value="" disabled hidden>Prints & Patterns</option>
                            <option value="">All Patterns</option>
                            {patternOptions.map(opt => 
                                <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select> */}

                        {/* Neck/Collar Select */}
                        {/* <select value={neckStyle} onChange={(e) => setNeckStyle(e.target.value)}>
                            <option value="" disabled hidden>{category === 'tshirt' ? 'Neckline' : 'Collar Style'}</option>
                            {(category === 'tshirt' ? neckOptions : collarOptions).map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select> */}
                </section>


                <section className='relative grow px-[5%] xl:grid xl:grid-cols-5 gap-0 xl:gap-8 py-4 lg:py-8 min-h-fit'>
                    {asideVisible && <div className="fixed inset-0 z-10" onClick={() => setAsideVisible(false)} />}

                    <aside className={`absolute top-0 left-0 z-10 overflow-y-auto h-full w-full xs:w-80 bg-white px-4 py-4 lg:py-8 shadow-2xl transition-transform duration-300 ease-in-out
                                ${asideVisible ? 'translate-x-0' : '-translate-x-full'}
                                xl:static xl:h-auto xl:w-full xl:max-w-none xl:translate-x-0 xl:shadow-none xl:p-0 xl:col-span-1`}>
                    <FadeIn className='space-y-6'>
                        <h2 className='font-semibold text-lg my-3 flex justify-between items-center'>
                            <span>Filter Options</span>
                            <MdClose onClick={() => setAsideVisible(false)}   className='w-7 h-7 mr-2 xl:hidden'/>
                        </h2>
                        <hr className='text-gray-300' />
                        <div className='flex flex-col gap-2'>
                            {/* <h2 className='font-semibold text-lg'>Status</h2> */}
                            <label className="flex items-center justify-between text-black px-4 cursor-pointer">
                                <div className='flex items-center gap-3'>
                                    <input 
                                        className='w-4 h-4'
                                        type="checkbox"
                                        checked={newArrival}
                                        onChange={() => setNewArrival(!newArrival)}
                                    />
                                    <span className='text-sm'>New Arrivals</span>
                                </div>
                                <span className='text-sm'>{allProductsUnfiltered.filter(p => p.is_new_arrival).length}</span>
                            </label>
                        </div>
                        <hr className='text-gray-300' />
                        <div className='flex flex-col gap-2'>
                            <h2 className='font-semibold text-lg'>Category</h2>
                            {categoryOptions.map((option) => {
                                const staticCount = allProductsUnfiltered.filter(p => p.category === option.value).length;
                                return (
                                    <label key={option.value} className="flex items-center justify-between text-black px-4 cursor-pointer">
                                        <div className='flex items-center gap-3'>
                                            <input className='w-4 h-4'
                                                type="checkbox"
                                                value={option.value}
                                                checked={categories.includes(option.value)}
                                                onChange={(e) => handleFilterChange(option.value, e.target.checked, setCategories)}
                                            />
                                            <span className='text-sm'>{option.label}</span>
                                        </div>
                                        <span className='text-sm'>{staticCount}</span>
                                    </label>
                                )}
                            )}
                        </div>
                        <hr className='text-gray-300' />

                        <div className='flex flex-col gap-2'>
                            <h2 className='font-semibold text-lg'>Style</h2>
                            {styleOptions.map((option) => (
                                <label key={option.value} className="flex items-center gap-3 text-black px-4 cursor-pointer">
                                    <input className='w-4 h-4'
                                        type="checkbox"
                                        value={option.value}
                                        checked={styles.includes(option.value)}
                                        onChange={(e) => handleFilterChange(option.value, e.target.checked, setStyles)}
                                    />
                                    <span className='text-sm'>{option.label}</span>
                                </label>
                            ))}
                        </div>
                        <hr className='text-gray-300' />

                        <div className='flex flex-col gap-2'>
                            <h2 className='font-semibold text-lg'>Prints & Patterns</h2>
                            {patternOptions.map((option) => (
                                <label key={option.value} className="flex items-center gap-3 text-black px-4 cursor-pointer">
                                    <input className='w-4 h-4'
                                        type="checkbox"
                                        value={option.value}
                                        checked={patterns.includes(option.value)}
                                        onChange={(e) => handleFilterChange(option.value, e.target.checked, setPatterns)}
                                    />
                                    <span className='text-sm'>{option.label}</span>
                                </label>
                            ))}
                        </div>
                        <hr className='text-gray-300' />

                        <div className='flex flex-col gap-2'>
                            <h2 className='font-semibold text-lg'>Sleeve Type</h2>
                            {sleeveOptions.map((option) => (
                                <label key={option.value} className="flex items-center gap-3 text-black px-4 cursor-pointer">
                                    <input className='w-4 h-4'
                                        type="checkbox"
                                        value={option.value}
                                        checked={sleeveTypes.includes(option.value)}
                                        onChange={(e) => handleFilterChange(option.value, e.target.checked, setSleeveTypes)}
                                    />
                                    <span className='text-sm'>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </FadeIn>
                    </aside>


                    <main className='xl:col-span-4 space-y-4 min-h-screen'>
                        <FadeIn delay={0.1}>
                        <div className='sm:flex justify-between items-center space-x-2'>
                            <div className='relative w-full sm:w-75 my-2'>
                                <input type="search" placeholder='Search products...'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)} 
                                    className='w-full border border-gray-300! bg-white!' />
                                {/* <div className='absolute inset-y-0 flex items-center pointer-events-none right-0 pr-1 py-2'>
                                    <MdSearch size={28} className='text-gray-800 bg-white rounded-full p-1' />
                                </div> */}
                            </div>

                            <div className='flex gap-2 items-center'>
                                {/* {!asideVisible && */}
                                    <div className='xl:hidden w-1/2 sm:w-auto text-sm md:text-base '>
                                        <button onClick={() => setAsideVisible(true)} className='btn-primary w-full'><FaFilter />Filters</button>
                                    </div>
                                {/* } */}
                                {/* <select // value={ordering} 
                                    defaultValue='' onChange={(e) => setOrdering(e.target.value)} className="bg-white! border p-2! w-36 rounded">
                                    <option value="" disabled hidden>Sort by</option>
                                    <option value="price">Price-- Low to High</option>
                                    <option value="-price">Price--High to Low</option>
                                    <option value="-id">Newest First</option>
                                    <option value="id">Oldest First</option>
                                    <option value="name">Name (A-Z)</option>
                                    <option value="-name">Name (Z-A)</option>
                                </select> */}
                                <div className="relative inline-block w-1/2 sm:w-44 text-sm">
                                    <div onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="w-full bg-white border border-gray-300 p-2 rounded flex justify-between items-center cursor-pointer text-black hover:border-emerald-800 transition-colors"
                                    >
                                        <span>
                                            {ordering === 'price' && 'Price: Low to High'}
                                            {ordering === '-price' && 'Price: High to Low'}
                                            {ordering === '-id' && 'Newest First'}
                                            {ordering === 'id' && 'Oldest First'}
                                            {ordering === '' && 'Sort by'}
                                        </span>
                                        <span className={`transform transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>▼</span>
                                    </div>

                                    {isSortOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                            
                                            <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg overflow-hidden z-20">
                                                {[
                                                    { value: 'price', label: 'Price: Low to High' },
                                                    { value: '-price', label: 'Price: High to Low' },
                                                    { value: '-id', label: 'Newest First' },
                                                    { value: 'id', label: 'Oldest First' },
                                                    // { value: 'name', label: 'Name (A-Z)' },
                                                    // { value: '-name', label: 'Name (Z-A)' }
                                                ].map((option) => {
                                                    const isSelected = ordering === option.value;
                                                    return (
                                                        <li 
                                                            key={option.value}
                                                            onClick={() => {
                                                                setOrdering(option.value); // Set your state value
                                                                setIsSortOpen(false);      // Close menu
                                                            }}
                                                            className={`px-4 py-2.5 cursor-pointer text-left transition-colors
                                                                ${isSelected 
                                                                    ? 'bg-emerald-800 text-white font-medium' 
                                                                    : 'text-gray-700 hover:bg-emerald-900 hover:text-white'
                                                                }`
                                                            }
                                                        >
                                                            {option.label}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </>
                                    )}
                                </div>
                                {/* <button onClick={() => setNewArrival(!newArrival)} className={`border py-1.5! rounded-full! ${newArrival ? 'text-white bg-black border-black' : 'border-gray-500 bg-gray-200'}`} >New Arrivals</button> */}
                            </div>
                        </div>
                        </FadeIn>

                        {activeFilters.length > 0 && (
                            <FadeIn>
                            <div className='flex items-center gap-2 lg:gap-4'>
                                <h2 className='flex shrink-0'>Active Filters :</h2>
                                <div className='flex overflow-x-scroll no-scrollbar gap-2 lg:gap-4'>
                                {activeFilters.map((filter, index) => (
                                    <div 
                                        key={index}
                                        // onClick={() => filter.type === 'bool' ? filter.set(false) : handleFilterChange(filter.value, false, filter.set)}
                                        onClick={() => filter.type === 'bool' ? filter.set(false) : filter.set(prev => prev.filter(item => item !== filter.value))}
                                        className='bg-[#94bb86] text-emerald-800 font-semibold text-sm py-1.5 px-3 shrink-0 flex items-center gap-2 cursor-pointer hover:bg-[#83aa75] transition-colors'
                                        title="Click to remove filter"
                                    >
                                        <span>{filter.label}</span>
                                        <MdClose size={16} />
                                    </div>
                                ))}
                                </div>
                                
                                <a onClick={handleClearFilters} className='font-semibold min-w-fit text-emerald-800 underline cursor-pointer'>Clear All</a>
                            </div>
                            </FadeIn>
                        )}

                        { isInitialLoad ? (
                            <div className='flex flex-wrap space-y-1 md:space-y-0 sm:gap-3 lg:gap-6'>
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <ProductCardSkeleton  key={idx}/>
                            ))}
                            </div>
                        ) : isFetchingProducts ? (
                            <p className='text-center font-medium py-20'>Fetching products...</p>
                        ) : products && products.length > 0 ? (
                            <StaggerContainer key={ordering} className='flex flex-wrap space-y-1 md:space-y-0 sm:gap-3 lg:gap-6'>
                                {products
                                // .filter(p => p.is_active)
                                // .sort(() => 0.5 - Math.random())  // shuffle randomly
                                .map(product => (
                                    <StaggerItem key={product.id} className='w-1/2 max-w-56 sm:max-w-none sm:w-auto'>
                                        <ProductCard product={product} />
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        ) : (
                            <p className='text-center font-medium py-20'>No Results</p> 
                        )}
                        { (prevPage || nextPage) && (
                            <FadeIn delay={0.3}>
                                <div className='flex mt-10 justify-center gap-8'>
                                    <button disabled={!prevPage} onClick={() => loadProducts(prevPage)} className='text-black disabled:pointer-events-none disabled:text-gray-500' ><IoIosArrowBack size={24}/></button>

                                    <button disabled={!nextPage} onClick={() => loadProducts(nextPage)} className='text-black disabled:pointer-events-none disabled:text-gray-500' ><IoIosArrowForward size={24} /></button>
                                </div>
                            </FadeIn>
                        )}
                            
                    </main>
                </section>

                <section>
                    <Footer />
                </section>
            </div>

        </Fragment>
    );
}

export default Products;

