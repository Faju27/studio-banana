import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import Loader from '../../components/Loader';
import { MdEdit } from 'react-icons/md';
import { FaArrowDown, FaArrowUp, FaFilter, FaPlus } from 'react-icons/fa';
import  placeholderImage from '../../assets/PlaceholderImage.png';
import { FaArrowsUpDown } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { AdminProductsListSkeleton } from '../../components/skeletons';




const AllProducts = () => {
    const { fetchProductList, loading, categoryOptions, styleOptions, patternOptions, sleeveOptions, collarOptions, neckOptions} = useProducts()

    const [adminProducts, setAdminProducts] = useState([]);
    const [adminNext, setAdminNext] = useState(null);
    const [adminPrev, setAdminPrev] = useState(null);

    // const [search, setSearch] = useState("");
    // const [ordering, setOrdering] = useState("");
    const [search, setSearch] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("search") || "";
    });

    const [ordering, setOrdering] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("ordering") || "";
    });

    const [categories, setCategories] = useState([]);
    const [sleeveTypes, setSleeveTypes] = useState([]);
    const [styles, setStyles] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [neckStyles, setNeckStyles] = useState([]);

    const [activeStatus, setActiveStatus] = useState("");
    const [newArrival, setNewArrival] = useState('');

    // const [pageSize, setPageSize] = useState(10);
    const [pageSize, setPageSize] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('page_size') || 10;
    });

    const [totalPage, setTotalPage] = useState(0);

    const [totalProducts, setTotalProducts] = useState(null); // Global stats (Unchanging)
    const [filteredCount, setFilteredCount] = useState(0); // Changes when searching/filtering

    const [asideVisible, setAsideVisible] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)

    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);

    const navigate = useNavigate()


    const loadAdminProducts = async (url) => {
        if (!url) return;

        setIsFetchingProducts(true)
        try {
            const data = await fetchProductList(url);

            if (data) {
                setAdminProducts(data.results);
                setAdminNext(data.next);
                setAdminPrev(data.previous);

                setFilteredCount(data.count || 0);

                const total = Math.ceil((data.count || 0) / pageSize);
                setTotalPage(total);
            }
        } catch (error) {
            console.error("Error loading products on page:", error);
        } finally {
            setIsFetchingProducts(false)
            setIsInitialLoad(false)
        }
    };
   
    // pagination, search bar & ordering without button
    useEffect(() => {        
        const delay = setTimeout(() => {
            // const url = `/products/?search=${search}&page_size=${pageSize}&ordering=${ordering}`;
            const params = new URLSearchParams();

            if (search) {
                params.set("search", search);
            }

            params.set("page_size", pageSize);
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
            if (activeStatus) {
                params.set("is_active", activeStatus);
            }

            // Update the browser URL dynamically without reloading
            const nextURLQuery = window.location.pathname + '?' + params.toString();
            window.history.replaceState(null, '', nextURLQuery);

            const url = `/products/?${params.toString()}`;

            loadAdminProducts(url);

        }, 400); // Debounce search

        return () => clearTimeout(delay);

    }, [search, pageSize, ordering, categories, sleeveTypes, styles, patterns, neckStyles, newArrival, activeStatus]);

    useEffect(() => {
        const fetchProductTotal = async () => {
            try {
                // pass an empty object '/products/' or clean URL so NO filters are applied
                const data = await fetchProductList('/products/total_count/'); 
                if (data) {
                    setTotalProducts(data.count);
                }
            } catch (error) {
                console.error("Error fetching total products:", error);
            }
        };
        fetchProductTotal();
    }, []);


    // // search bar & ordering without pagination , button
    // useEffect(() => {
    //     fetchProductList('/products/?no_pagination=true', false);
    // }, []);
    // const handleAdminSearch = (e) => {
    //     const url = `/products/?search=${search}&ordering=${ordering}&no_pagination=true`;
    //     fetchProductList(url, false);
    // };

    const handleClearFilters = () => {
        setCategories([]);
        setSleeveTypes([]);
        setStyles([]);
        setPatterns([]);
        setNeckStyles([]);
        setActiveStatus("");
        setNewArrival("")
    };

    const handleFilterChange = (value, checked, setFilter) => {
        if (checked) {
            setFilter(prev => [...prev, value]);
        } else {
            setFilter(prev => prev.filter(item => item !== value));
        }
    };
    
    const handleSort = (field) => {
        if (ordering === field) {
            setOrdering(`-${field}`);
        } else {
            setOrdering(field);
        }
    };

    
    if ( !adminProducts) return <Loader />;

    return (
        <Fragment>
            <section className='py-4 space-y-4'>
                <div className='flex justify-between'>
                    <h2 className='font-medium text-xl sm:text-2xl text-emerald-800!'>Products</h2>  

                    <button onClick={() => navigate('/admin/product-add')} className='gap-1 btn-primary '>
                        <FaPlus size={16} />
                        <span>New Product</span>
                    </button>
                </div>



                <div className='flex flex-col sm:flex-row gap-4 justify-between sm:items-center '>
                    <div className='flex gap-2'>
                        <input type="search" placeholder="Search products..." 
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            // onKeyDown={(e) => e.key === 'Enter' && handleAdminSearch()}
                            className="bg-white! shadow w-full xs:w-64"
                        />
                            {/* <button onClick={handleAdminSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                                Search
                            </button> */}
                    </div>
                    {/* <div className='flex gap-4 justify-between'>
                        { !asideVisible &&
                            <button onClick={() => setAsideVisible(true)} className='bg-white'><FaFilter />Filters</button>
                        }
                        <select // value={ordering} 
                            defaultValue='' onChange={(e) => setOrdering(e.target.value)} className="bg-white! border p-2! w-36 rounded">
                            <option value="" disabled hidden>Sort by</option>
                            <option value="price">Price-- Low to High</option>
                            <option value="-price">Price--High to Low</option>
                            <option value="-id">Newest First</option>
                            <option value="id">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="-name">Name (Z-A)</option>
                        </select>
                    </div>  */}
                     <div className='flex gap-2 items-center'>
                        {/* {!asideVisible && */}
                            <div className='order-3 sm:order-1 w-1/2  sm:w-auto '>
                                <button onClick={() => setAsideVisible(true)} className='btn-primary-outline w-full'><FaFilter />Filters</button>
                            </div>
                        {/* } */}
                        <div className="order-2 sm:order-1 relative inline-block w-44 xs:w-1/2 sm:w-44 text-sm">
                            <div onClick={() => setIsSortOpen(!isSortOpen)}
                                className="w-full bg-white border border-gray-300 p-2 rounded flex justify-between items-center cursor-pointer text-black hover:border-emerald-800 transition-colors"
                            >
                                <span className='truncate'>
                                    {ordering === 'discount_price' && 'Price: Low to High'}
                                    {ordering === '-discount_price' && 'Price: High to Low'}
                                    {ordering === '-id' && 'Newest First'}
                                    {ordering === 'id' && 'Oldest First'}
                                    {ordering === 'name' && 'Name (A-Z)'}
                                    {ordering === '-name' && 'Name (Z-A)'}                                    
                                    {ordering === '' && 'Sort by'}
                                </span>
                                <span className={`transform transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>▼</span>
                            </div>

                            {isSortOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                    
                                    <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg overflow-hidden z-20">
                                        {[
                                            { value: 'discount_price', label: 'Price: Low to High' },
                                            { value: '-discount_price', label: 'Price: High to Low' },
                                            { value: '-id', label: 'Newest First' },
                                            { value: 'id', label: 'Oldest First' },
                                            { value: 'name', label: 'Name (A-Z)' },
                                            { value: '-name', label: 'Name (Z-A)' }
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
                    </div>     
                </div>
                {asideVisible && <div className="fixed inset-0 z-10" onClick={() => setAsideVisible(false)} />}
                
                {/* {asideVisible && */}
                    <aside className={`fixed h-lvh bg-white space-y-4 w-74 p-4 z-10 top-0 right-0 transition-transform duration-700 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-l border-emerald-800 ${asideVisible ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}>
                        <div className='flex justify-between'>
                            <h2 className='font-semibold text-lg my-2'>Filter Options</h2>
                            <IoCloseOutline onClick={() => setAsideVisible(false)} size={40} className='text-black sm:text-gray-500 hover:text-black'/>
                        </div>
                        <hr className='text-gray-300' />
                        <div className='flex flex-col gap-2 '>
                            <h2 className='font-semibold'>Category</h2>
                            {categoryOptions.map((option) => (
                                <label key={option.value} className="flex items-center gap-3 text-black px-4 cursor-pointer">
                                    <input className='w-4 h-4'
                                        type="checkbox"
                                        value={option.value}
                                        checked={categories.includes(option.value)}
                                        onChange={(e) => handleFilterChange(option.value, e.target.checked, setCategories)}
                                    />
                                    <span className='text-sm'>{option.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className='flex flex-col gap-2 '>
                            <h2 className='font-semibold'>Style</h2>
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

                        <div className='flex flex-col gap-2 '>
                            <h2 className='font-semibold'>Prints & Patterns</h2>
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

                        <div className='flex flex-col gap-2 '>
                            <h2 className='font-semibold'>Sleeve Type</h2>
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

                        <div className='flex flex-col gap-2 '>
                            <h2 className="font-semibold">New Arrival</h2>
                            <label className="flex items-center gap-3 text-black px-4 cursor-pointer">
                                <input className='w-4 h-4'
                                    type="checkbox"
                                    name="newArrival"
                                    value={newArrival === 'true' ? '' : 'true'}
                                    checked={newArrival === "true"}
                                    onChange={(e) => setNewArrival(e.target.value)}
                                />
                                <span>Yes</span>
                            </label>
                        </div>       

                        <div className='flex flex-col gap-2'>
                            <h2 className="font-semibold">Status</h2>
                            <label className="flex items-center gap-3 text-black px-4 cursor-pointer">
                                <input className='w-4 h-4'
                                    type="radio"
                                    name="activeStatus"
                                    value=""
                                    checked={activeStatus === ""}
                                    onChange={(e) => setActiveStatus(e.target.value)}
                                />
                                <span>All</span>
                            </label>
                            <label className="flex items-center gap-3 text-black px-4 cursor-pointer">
                                <input className='w-4 h-4'
                                    type="radio"
                                    name="activeStatus"
                                    value={true}
                                    checked={activeStatus === "true"}
                                    onChange={(e) => setActiveStatus(e.target.value)}
                                />
                                <span>Active</span>
                            </label>

                            <label className="flex items-center gap-3 text-black px-4 cursor-pointer">
                                <input className='w-4 h-4'
                                    type="radio"
                                    name="activeStatus"
                                    value={false}
                                    checked={activeStatus === "false"}
                                    onChange={(e) => setActiveStatus(e.target.value)}
                                />
                                <span>Inactive</span>
                            </label>
                        </div>
                        <button onClick={handleClearFilters} className='place-self-center btn-primary'>Clear All</button>
                    </aside>
                {/* } */}
            </section>
                    
           {/* <AdminProductsListSkeleton /> */}
            
            <section className="sm:overflow-x-auto">
                {isInitialLoad ? (
                    <AdminProductsListSkeleton />
                // ) : isFetchingProducts ? (
                //     <p className='text-center font-medium py-20'>Fetching products...</p>
                ) : adminProducts && adminProducts.length > 0 ? (
                    <div className='space-y-2' >

                        <div className="hidden md:grid grid-cols-6 gap-2 lg:gap-4 px-4 py-3 text-xs uppercase text-gray-400 font-semibold">
                            <div onClick={() => handleSort('name')} className='col-span-2 flex items-center gap-1 cursor-pointer'>
                                <span>Product</span>
                                {ordering === 'name' ? <FaArrowUp /> : ordering === '-name' ? <FaArrowDown /> : <FaArrowsUpDown />}
                            </div>
                            <div >Category</div>
                            <div>Options</div>
                            <div onClick={() => handleSort('discount_price')} className='flex items-center gap-1 cursor-pointer'>
                                <span>Price</span>
                                {ordering === 'discount_price' ? <FaArrowUp /> : ordering === '-discount_price' ? <FaArrowDown /> : <FaArrowsUpDown />}
                            </div>
                            <div>Status</div>
                            {/* <div>Actions</div> */}
                        </div>


                        <div className="space-y-2">
                            {adminProducts
                            // .filter(p => p.is_active === true)
                            // .toSorted((a, b) => b.id - a.id)
                            // .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // condition based reversing
                            // .toReversed()
                            .map(p => (
                                <div key={p.id} onClick={() => navigate(`${p.id}/manage`)} className="grid grid-cols-2 md:grid-cols-6 gap- lg:gap-5 bg-white hover:bg-gray-100 transition-colors shadow-sm rounded-lg px-2 md:px-4 py-2 items-center overflow-hidden">
                                    
                                    <div className="col-span-2 flex gap-2 cursor-pointer">
                                        <div className="w-18 md:w-16 md:h-16 aspect-3/4 relative bg-gray-100 rounded-md overflow-hidden shrink-0">
                                            <img src={p.images?.[0]?.image || placeholderImage } alt={p.name} className="w-full h-full object-cover" />
                                            {p.is_new_arrival === true && 
                                                <span className='absolute top-0 left-0 z-10 font-bold bg-amber-50 text-amber-700 text-[10px] uppercase py-0.5 px-4 -rotate-45 -translate-x-4 shadow-sm'>New</span>
                                            }
                                        </div>
                                        <div className='content-center py-1 space-y-1 md:space-y-0'>
                                            <p className='font-semibold text-black line-clamp-2' title={p.name}>{p.name}</p>
                                            <div className="md:hidden bg-gray-200 text-xs text-gray-800 font-semibold capitalize text-center rounded-lg px-2 py-1 w-32 shrink-0">{ p.category}</div>
                                            <div className="flex md:hidden gap-1">
                                                {p.colors.map(c =>
                                                    <span key={c.id} className='w-4 h-4 rounded-full border ' style={{backgroundColor : c.hex_code}} ></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:block bg-gray-200 text-xs text-gray-800 font-semibold capitalize text-center rounded-lg px-2 py-1 w-auto max-w-32 shrink-0">{ p.category}</div>

                                    <div className="hidden md:flex gap-1">
                                        {p.colors.map(c =>
                                            <span key={c.id} className='w-4 h-4 rounded-full border ' style={{backgroundColor : c.hex_code}} ></span>
                                        )}
                                    </div>
                                    
                                    {/* <div className='flex '>
                                        <span className="lg:text-lg text-emerald-800 font-semibold">${p.price}</span>
                                        <span>${p.discount_price}</span>
                                    </div> */}
                                    <div className='col-span-1 flex flex-col md:justify-center'>
                                        <span className='text-xs text-gray-400 block md:hidden'>Price:</span>
                                        <div className='flex items-center md:items-start gap-1 md:flex-col'>
                                            <span className='text-black font-semibold'>${p.discount_price !== null ? p.discount_price : p.price}</span>
                                            {p.discount_price !== null && (
                                                <span className='line-through text-gray-500 text-sm lg:text-base'>${ p.price }</span>
                                            )}
                                        </div>
                                    </div>

                                    
                                    <div className='flex flex-col gap-1 place-self-end md:place-self-auto'>
                                        <span className='text-xs text-gray-400 block md:hidden'>Status:</span>
                                        {p.is_active === true ? 
                                        <span className='bg-emerald-800 text-white px-4 py-1 text-center text-xs rounded-lg font-semibold w-fit xs:w-32 md:w-fit'>Active</span>
                                        :
                                        <span className='bg-red-600 text-white px-4 py-1 text-center text-xs rounded-lg font-semibold w-fit xs:w-32 md:w-fit'>Inactive</span>
                                        }
                                    </div>

                                    {/* <div>
                                        <button className='w-full sm:w-auto bg-gray-100 gap-1'>
                                            <MdEdit size={16} className='block sm:hidden'/>
                                            <span className="sm:inline">Edit</span>
                                        </button>
                                    </div> */}
                                    
                                </div>
                            ))}
                        </div>
                    


                        {/* Pagination */}
                        <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-2 mt-4'>
                            <div className='flex items-center gap-2'>
                                
                                <select // value={pageSize}
                                    defaultValue='' onChange={(e) => setPageSize(e.target.value)} className="bg-white! border px-1! py-1!">
                                    <option value="10">10</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <p>
                                {totalProducts === null
                                    ? `Showing ${filteredCount} products`
                                    : filteredCount === totalProducts
                                        ? `Showing ${totalProducts} products`
                                        : `Filtered ${filteredCount} products from ${totalProducts}`
                                }
                                </p>
                            </div>
                            <div className='flex items-center gap-2 sm:gap-4 mx-auto sm:mx-0'>
                                <p>Total Pages : <span className='text-black font-semibold'>{totalPage}</span></p>

                                <div className="flex gap-2 sm:gap-4 content-center justify-end">
                                    <button 
                                        disabled={!adminPrev || loading} 
                                        onClick={() => loadAdminProducts(adminPrev)}
                                        className="p-2 btn-primary-outline disabled:opacity-50 disabled:cursor-not-allowed!"
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        disabled={!adminNext || loading} 
                                        onClick={() => loadAdminProducts(adminNext)}
                                        className="p-2 btn-primary-outline disabled:opacity-50 disabled:cursor-not-allowed!"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className='text-center font-medium py-20'>No Results</p>
                )}
            </section>



        </Fragment>
    );
}

export default AllProducts;
