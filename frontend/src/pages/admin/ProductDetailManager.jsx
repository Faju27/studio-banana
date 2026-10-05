import { Fragment, useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { MdClose, MdKeyboardBackspace, MdOutlineInfo } from 'react-icons/md';
import { IoMdImages } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import Loader from "../../components/Loader";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";

const ProductDetailManager = () => {

    const {productId} = useParams()
    const { updateProductField, fetchProductDetails, product, categoryOptions, sleeveOptions, styleOptions, patternOptions, collarOptions, neckOptions  } = useProducts()
    
    const [tempColor, setTempColor] = useState({ name: "", hex: "#000000" });
    const [globalColors, setGlobalColors] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [imageToDelete, setImagetoDelete] = useState(null);

    const navigate = useNavigate()

    const [isUpdating, setIsUpdating] = useState(false)
    const [isUploading, setIsUploading] = useState(false);


    useEffect(() => {
        if (productId) {
            fetchProductDetails(productId)
        }
    },[productId])

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const res = await api.get("/product-colors/")
                setGlobalColors(res.data);
            } catch (error) {
                console.error("Failed to fetch colors:", error);
            }
        };

        fetchColors();
    },[])

// Sizes

    const handleUpdateSize = (size) => {
        const isSelected = product.sizes.some(s => s.name === size);
        if (isSelected && product.sizes.length === 1) {
            toast('A product must have at least one available size.', { icon: '⚠️' });
            return;
        }
        const newSizes = product.sizes.some(s => s.name === size)       // check if already there
            ? product.sizes.filter(s => s.name !== size).map(s => s.name) // Remove if already there
            : [...product.sizes.map(s => s.name), size];      // Add if not there

        updateProductField(product.id, 'sizes', newSizes, product.sizes);
    };

// Images

    const handleAutoUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        const imageData = new FormData();
        imageData.append("product", productId);
        imageData.append("image", file);
        
        try {
            await api.post("/product-images/", imageData);
            
            toast.success("Image uploaded!");
            
            fetchProductDetails(productId);

        } catch (err) {
            console.error(err);
            toast.error("Image Upload failed.");
        } finally {
            setIsUploading(false);
            e.target.value = ""; 
        }
    };

    const handleReplaceImage = async (imageId, newFile) => {
        const imageData = new FormData();
        imageData.append("image", newFile);
        try {
            await api.patch(`/product-images/${imageId}/`, imageData);

            console.log('Image replaced successfully');
            toast.success("Image replaced.");
            
            fetchProductDetails(productId);
        } catch (err) {
            console.error(err);
            toast.error("Failed to replace image.");
        }
    };
    
    const handleDeleteImage = async (imageId) => {
        try {
            await api.delete(`/product-images/${imageId}/`);

            console.log("Image deleted successfully");
            toast.success("Image deleted.");
            
            fetchProductDetails(productId); 
        } catch (err) {
            toast.error("Failed to delete image");
            console.error(err);
        }
    };
    
// Colors

    const handleAddColor = async () => {
        const colorName = tempColor.name.trim().toLowerCase();

        if (!colorName) {
            toast('Please enter a color name.', { icon: '⚠️' });
            return;
        }

        // Already linked to this product?
        const alreadyAdded = product.colors.some(
            c => c.name.toLowerCase() === colorName
        );

        if (alreadyAdded) {
            toast(`${colorName} is already added to this product.`, { icon: '⚠️' });
            return;
        }

        // Does the color already exist globally?
        const existingColor = globalColors.find(
            c => c.name.toLowerCase() === colorName
        );

        try {
            if (existingColor) {
                // Existing global color → just link it to product
                const newColors = [...product.colors.map(c => c.name), existingColor.name.toLowerCase()];

                await updateProductField(product.id, 'colors', newColors, product.colors.map(c => c.name));

                toast.success(`${existingColor.name} already exists. Added it to this product.`);

            } else {
                // New global color → create it first
                await api.post('/product-colors/', {
                    name: colorName,
                    hex_code: tempColor.hex
                });

                const newColors = [
                    ...product.colors.map(c => c.name),
                    colorName
                ];

                await updateProductField(product.id, 'colors', newColors, product.colors.map(c => c.name));

                toast.success(`${colorName} created and added to this product.`);
                
            }

            setShowModal(false);
            setTempColor({name: '', hex: '#000000'});

        } catch (err) {
            console.error(err);
            toast.error('Failed to add color.');
        }

    };

    const handleRemoveColor = (nameToRemove) => {
         if (product.colors.length === 1) {
            toast('A product must have at least one available color.', { icon: '⚠️' });
            return;
        }
        const newColors = product.colors
            .filter(c => c.name !== nameToRemove)
            .map(c => c.name);

        updateProductField(product.id, 'colors', newColors, product.colors.map(c => c.name));
    };

    const handleSelectChange = async (e) => {
        const value = e.target.value;

        if (value === "ADD_NEW") {
            setShowModal(true); // Open the modal
            return;
        }

        if (value) {
            // Existing color selected: Link it instantly
            const currentNames = product.colors.map(c => c.name.toLowerCase());
            if (!currentNames.includes(value.toLowerCase())) {
                const updatedNames = [...currentNames, value.toLowerCase()];
                await updateProductField(product.id, 'colors', updatedNames, currentNames);
            }
        }
    };
    // const handleColor = (e) => {
    //     const value = e.target.value;

    //     if (value === "ADD_NEW") {
    //         setShowModal(true);
    //         return;
    //     }

    //     if (value) {
    //         const existingColor = globalColors.find(c => c.name === value);
            
    //         if (!selectedColors.some(c => c.name.toLowerCase() === value.toLowerCase())) {  // for prevent duplicates
    //             // Add existing color to local list
    //             setSelectedColors([...selectedColors, { 
    //                 name: existingColor.name.toLowerCase(), 
    //                 hex: existingColor.hex_code 
    //             }]);
    //         }
    //     }
    // };


    if (!product) return <p>Please reload the page.... </p>;


    return (
        <Fragment>
            <section className='flex items-center gap-2 sm:gap-4 py-4'>
                <MdKeyboardBackspace onClick={() => navigate(-1)} className='w-9 h-9 sm:w-11 sm:h-11 p-2 rounded-md border text-emerald-800 bg-white hover:bg-gray-300'/>
                <div>
                    <p>Back to product list</p>
                    <h2 className='font-medium text-xl sm:text-2xl text-emerald-800!'>Product Details</h2>
                </div>
            </section>
            {isUpdating && <p>toast saving ...</p>}

            <section className='grid grid-cols-12 gap-2 sm:gap-4 '>
                <div className='col-span-12 lg:col-span-7 space-y-2 sm:space-y-4'>
                    <div className='form-section'>
                        <h2 className='section-title'> General Information</h2>
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:gap-5">
                            <div className="order-3 sm:order-1 sm:col-span-3 flex flex-col">
                                <label>Prouct Name <span className="text-red-600">*</span></label>
                                <input type="text" defaultValue={product.name} onBlur={async (e) => {setIsUpdating(true);updateProductField(product.id, 'name', e.target.value, product.name);setIsUpdating(false)}} required/>
                            </div>
                            <div className="order-2 sm:order-1 sm:col-span-1 flex flex-col ">
                                <label className='text-black'>Product ID</label>
                                <input defaultValue={product.id} disabled />
                            </div>
                        </div>
                        <label className="mt-2">Business Description <span className="text-red-600">*</span></label>
                        <textarea defaultValue={product.description} onBlur={(e) => updateProductField(product.id, 'description', e.target.value, product.description)}  rows={7}></textarea>
                    </div>

                    <div className='form-section'>
                        <h2 className='section-title'>Product Attributes</h2>
                        <label>Category <span className="text-red-600">*</span></label>
                        <select name="category" defaultValue={product.category} onBlur={(e) => updateProductField(product.id, 'category', e.target.value, product.category)} required>
                            <option value="" disabled>Select Category</option>
                            {categoryOptions.map(opt => 
                                <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>

                        <label className='mt-2'>Sleeve Length <span className="text-red-600">*</span></label>
                        <select name="sleeve_type" defaultValue={product.sleeve_type} onBlur={(e) => updateProductField(product.id, 'sleeve_type', e.target.value, product.sleeve_type)} required>
                            <option value="" disabled>Select Sleeve Type</option>
                            {sleeveOptions.map(opt => 
                                <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>

                        <label className='mt-2'>Style</label>
                            <select name="style" defaultValue={product.style} onBlur={(e) => updateProductField(product.id, 'style', e.target.value, product.style)}>
                                <option value="" disabled>Select Style</option>
                                {styleOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                                {product.style && <option value="" className="text-red-600 font-bold">None / Remove</option> }
                            </select>

                        <label className='mt-2'>Prints & Pattern</label>
                        <select name="pattern" defaultValue={product.pattern} onBlur={(e) => updateProductField(product.id, 'pattern', e.target.value, product.pattern)}>
                            <option value="" disabled>Select Prints & Pattern</option>    
                            {patternOptions.map(opt => 
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            )}
                            {product.pattern && <option value="" className="text-red-600 font-bold">None / Remove</option> }
                        </select>

                        <label className='mt-2'>Neck Style <span className="text-red-600">*</span></label>
                        <select name="neck_style" defaultValue={product.neck_style} onBlur={(e) => updateProductField(product.id, 'neck_style', e.target.value, product.neck_style)} required>
                            <option value="" disabled>Select Neck Style</option>
                            {(product.category === 'tshirt' ? neckOptions : collarOptions).map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-section'>
                        <h2 className='section-title'>Sizes & Colors</h2>
                        <div className='flex flex-col'>
                            <label>Available Sizes</label>
                            <div className='flex flex-wrap gap-1 sm:gap-5'>
                                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                    <button key={size} type="button" onClick={() => handleUpdateSize(size)}
                                    className={`rounded-sm! border border-gray-300 px-4! sm:px-5! w-10 sm:w-12 ${product.sizes.some(s => s.name === size) ? 'bg-white text-black font-semibold' : 'bg-gray-300' }`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className='mt-2'>
                            <div className="flex flex-col gap-1">
                                <label>Available Colors</label>
                                <select value="" onChange={handleSelectChange}>
                                    <option value="" hidden>Select or Add New Color</option>
                                    {globalColors
                                    .filter(gc => !product.colors.some(pc => pc.name === gc.name))  // to hide already added colors
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map(c => (
                                        <option key={c.name} value={c.name} 
                                        // style={{ backgroundColor: c.hex_code }}
                                        >
                                            {c.name.toUpperCase()} — {c.hex_code.toUpperCase()}
                                        </option>
                                    ))}
                                    <option value="ADD_NEW" className="text-blue-600 font-bold">+ Add another Color</option>
                                </select>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2 col-span-2">
                                {product.colors.map((c) => (
                                    <div key={c.id} className="flex items-center gap-1 border p-1">
                                        <div 
                                            style={{ backgroundColor: c.hex_code }} 
                                            className="w-5 h-5 rounded-full border border-gray-300" 
                                        />
                                        <span className="text-sm font-medium capitalize">{c.name}</span>
                                        <MdClose type='button' onClick={() => handleRemoveColor(c.name)} size={15} className='text-red-500' />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- THE MODAL --- */}
                        {showModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm space-y-4">
                                    <h2 className="section-title">Create New Color</h2>
                                    
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Color Name <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            placeholder="Color Name (e.g. Navy Blue)"
                                            value={tempColor.name}
                                            onChange={(e) => setTempColor({...tempColor, name: e.target.value})}
                                            className="w-full border capitalize"
                                            autoFocus
                                        />
                                        <div className="flex items-center gap-3 border p-2 rounded">
                                            <span className="text-sm text-gray-500 shrink-0">Pick Hex:</span>
                                            <input 
                                                type="color" 
                                                value={tempColor.hex}
                                                onChange={(e) => setTempColor({...tempColor, hex: e.target.value})}
                                                className="w-8 h-8 p-0! border-2 border-gray-300 rounded-sm! cursor-pointer align-middle [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:p-0 [&::-webkit-color-swatch-wrapper]:p-0" 
                                            />
                                            <input type="text" value={tempColor.hex} onChange={(e) => setTempColor({...tempColor, hex: e.target.value})} className='uppercase w-36 sm:w-auto' />
                                            {/* <span className="text-xs uppercase">{tempColor.hex}</span> */}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-black p-2 font-medium"> Cancel</button>
                                        <button onClick={handleAddColor} className="flex-1 btn-primary"> Add & Link</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='form-section'>
                        <h2 className='section-title'>Product Status</h2>
                        <div className='col-span-1 flex flex-col'>
                            <span className={`text-sm mb-2 ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                {product.is_active ? 
                                '✓ This product is currently live and visible to customers.'
                                :
                                '⚠ This product is hidden from the store.'
                                }
                            </span>
                            <label className='flex items-center gap-3 cursor-pointer'> 
                                <input type="checkbox" className="w-5 h-5" checked={product.is_active} 
                                    onChange={(e) => updateProductField(product.id, 'is_active', e.target.checked, product.is_active)} />
                                <span>
                                    {product.is_active ?
                                    'Active / In Stock'
                                    :
                                    'Inactive / Out of Stock'
                                    }
                                    </span>
                            </label>
                        </div>
                        <div className='col-span-1 flex flex-col mt-4'>
                            <span className={`text-sm mb-2 ${product.is_new_arrival ? 'text-green-600' : 'text-indigo-600'}`}>
                                {product.is_new_arrival 
                                ? <span>✓ This item is currently featured in New Arrivals.</span>
                                : <span>Check to showcase this item in the New Arrivals section.</span>
                                }
                            </span>
                            <label className='flex items-center gap-3 cursor-pointer'> 
                                <input type="checkbox" className="w-5 h-5" checked={product.is_new_arrival} onChange={(e) => updateProductField(product.id, 'is_new_arrival', e.target.checked, product.is_new_arrival)} />
                                <span>Mark as New Arrival </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className='col-span-12 lg:col-span-5 space-y-2 sm:space-y-4'>
                    <div className="form-section">
                        <h2 className='section-title flex items-center gap-2'>
                            <span>Product Gallery</span> 
                            <div className='relative group hidden md:flex items-center gap-2' tabIndex={0}>
                                <MdOutlineInfo size={20} className='cursor-help'/>
                                <span className='absolute -top-6 w-60 right-0 z-30 hidden group-focus-within:block group-hover:block text-xs bg-black text-white px-2 py-1 rounded '>Use a square 1:1 image for best results.</span>
                            </div>
                        </h2>
                        <div className='flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full '>
                            
                            {product.images.map((img, index) => (
                                <div key={img.id} className='image-box group relative shrink-0 overflow-hidden' tabIndex={0}>
                                    {index === 0 && 
                                        <span className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                                            Cover
                                        </span>
                                    }
                                    <img src={img.image} alt="product-image" className='w-full h-full object-cover transition-all group-hover:scale-105 group-hover:brightness-50'/>
                                    <div className='hidden group-focus-within:flex group-hover:flex flex-col gap-2 absolute inset-0 items-center justify-center'>
                                        <button type='button' onClick={() => document.getElementById(`imageReplace-${img.id}`).click()} className='bg-white pointer-events-auto'>Replace</button>
                                        {index !== 0 &&
                                            <button type='button' onClick={() => setImagetoDelete(img.id)} className='bg-red-500 text-white pointer-events-auto'>Remove</button>
                                        }
                                    </div>
                                    <input type="file" id={`imageReplace-${img.id}`} onChange={(e) => handleReplaceImage(img.id, e.target.files[0])} hidden />
                                </div>
                            ))}
                            <ConfirmModal
                                isOpen={imageToDelete}
                                title="Delete Image?"
                                message="Are you sure you want to delete this image?"
                                confirmText="Delete"
                                cancelText="Cancel"
                                onConfirm={async () => {
                                    await handleDeleteImage(imageToDelete);
                                    setImagetoDelete(null)
                                }}
                                onCancel={() => setImagetoDelete(null)}
                            />
                            <div onClick={() => document.getElementById("imageInput").click()} className='image-box border-dashed! shrink-0 px-2'>
                                <IoMdImages size={28} />
                                {isUploading ? ( 
                                    <span>
                                        {/* <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> */}
                                        Uploading...
                                    </span>
                                ) : (
                                    <>
                                        <span className='text-blue-600 hover:underline text-sm text-center'>Click to Add Gallery Images</span>
                                        <span className='block md:hidden text-xs text-center'>Use a square 1:1 image for best results</span>
                                        <input type="file" id='imageInput' onChange={handleAutoUploadImage} hidden multiple />
                                    </>
                                )}
                            </div>

                        </div>
                    </div>

                   
                    <div className="form-section">
                        <h2 className='section-title'>Pricing & Inventory</h2>
                        <div className='gap-2 grid! grid-cols-2'>
                            <div className='col-span-2 sm:col-span-1 flex flex-col'>
                                <label>Base Price <span className="text-red-600">*</span></label>
                                <input type="number" name="price" defaultValue={product.price} onBlur={(e) => updateProductField(product.id, 'price', e.target.value, product.price)} />
                            </div>
                            <div className='col-span-2 sm:col-span-1 flex flex-col'>
                                <label>Discount Price</label>
                                <input type="number" name="discount_price" defaultValue={product.discount_price ? product.discount_price : product.price} onBlur={(e) => updateProductField(product.id, 'discount_price', e.target.value, product.discount_price)} />
                            </div>
                            <div className='col-span-2 sm:col-span-1 flex flex-col'>
                                <label>Total Stock <span className="text-red-600">*</span></label>
                                <input type="number" defaultValue={product.stock} onBlur={(e) => updateProductField(product.id, 'stock', e.target.value, product.stock)} />
                            </div>
                        </div>
                    </div>
                

                </div>
            </section>
      </Fragment>
    );
}

export default ProductDetailManager;