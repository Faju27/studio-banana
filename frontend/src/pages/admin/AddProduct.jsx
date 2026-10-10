import React, { Fragment, useEffect, useState } from 'react';
import api from '../../api/axios';
import { MdClose, MdOutlineInfo } from 'react-icons/md';
import { IoMdImages } from "react-icons/io";
import { SketchPicker } from 'react-color'
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';

const AddProduct = () => {

    const { categoryOptions, sleeveOptions, styleOptions, patternOptions, collarOptions, neckOptions } = useProducts();

    //for 
    const initialFormState = {      
        name: "", 
        category: "",
        sleeve_type:"",
        style:"",
        pattern:"",
        neck_style:"", 
        description: "",
        sizes: [],
        colors: [],
        price: "",
        discount_price: "",
        stock:"",
        is_new_arrival: false, 
        is_active: true,
    };

    const [productForm, setProductForm] = useState(initialFormState)
    // const [productForm, setProductForm] = useState({
    //     name: "", category: "", description: "",
    //     price: "", is_new_arrival: false,is_active: true,
    // });
    const [productImage, setProductImage] = useState(null);  // for product image state  
    const [preview, setPreview] = useState(null);


    const [selectedColors, setSelectedColors] = useState([]);  // for to store colors/data in local array
    const [tempColor, setTempColor] = useState({ name: "", hex: "#000000" });
    const [globalColors, setGlobalColors] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);      // for just product add action 

    const navigate = useNavigate();


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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'category') {
            setProductForm(prev => ({
                ...prev,
                category: value,
                neck_style: value === 'tshirt' ? 'round' : 'button_down'
            }));
            return; 
        }


        if (name === 'price' || name === 'discount_price') {
            const basePrice = name === 'price' ? parseFloat(value) : parseFloat(productForm.price);
            const discountPrice= name === 'discount_price' ? parseFloat(value) : parseFloat(productForm.discount_price);

            if (discountPrice> basePrice) {
                toast("Discount price cannot be higher than the base price!", { icon: '⚠️' });
                return; 
            }
        }

        setProductForm( prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            setProductImage(file);
            setPreview(URL.createObjectURL(file));  // for user to see what file is selected, Creates a temporary URL for the browser 
        }
    };

    const handleSizeToggle = (size) => {
        setProductForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size) // Remove
                : [...prev.sizes, size]             // Add
        }));
    };

    const addColor = () => {
        const colorName = tempColor.name.trim().toLowerCase();
        
        if (!colorName) {
            toast("Please enter a color name!", { icon: '⚠️' });
            return;
        }

        // Check if the color is already in DB
        const existingColor = globalColors.find(gc => gc.name.toLowerCase() === colorName);

        const finalHex = existingColor ? existingColor.hex_code : tempColor.hex;

        // Prevent duplicates in the selected list
        if (selectedColors.some(c => c.name.toLowerCase() === colorName)) {
            toast("This color is already added!", { icon: '⚠️' });
            return;
        }

        setSelectedColors([...selectedColors, { name: colorName, hex: finalHex }]);

        setShowModal(false);
        setTempColor({ name: "", hex: "#000000" });
    };

    const handleColor = (e) => {
        const value = e.target.value;

        if (value === "ADD_NEW") {
            setShowModal(true);
            return;
        }

        if (value) {
            const existingColor = globalColors.find(c => c.name === value);
            
            if (!selectedColors.some(c => c.name.toLowerCase() === value.toLowerCase())) {  // for prevent duplicates
                // Add existing color to local list
                setSelectedColors([...selectedColors, { 
                    name: existingColor.name.toLowerCase(), 
                    hex: existingColor.hex_code 
                }]);
            }
        }
    };
    
    const removeColor = (colorName) => {
        setSelectedColors(selectedColors.filter(c => c.name !== colorName));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productImage) {
            return toast("Please select a cover image!", { icon: '⚠️' });
        }
        // if (!productForm.sizes || productForm.sizes.length === 0) {
        //     return toast("Please select at least one size.", { icon: '⚠️' });
        // }
        if (!selectedColors || selectedColors.length === 0) {
            return toast("Please select at least one color.", { icon: '⚠️' });
        }
        setIsSubmitting(true);

        try {

            await Promise.all(selectedColors.map(async (c) => {

                const exists = globalColors.find(gc => gc.name.toLowerCase() === c.name.toLowerCase());
                if (!exists) {
                    try {
                        await api.post("/product-colors/", { name: c.name, hex_code: c.hex });
                    } catch (err) {
                        console.error("Color exists or creation failed", err);
                        // toast.error(`${c.name} already exists, ready to link.`);
                    }
                } else {
                    console.log(`${c.name} already in DB, skipping post.`);
                }
            }));

            const finalProductData = {
                ...productForm,
                colors: selectedColors.map(c => c.name.toLowerCase())
            };

            // Create the Product
            const res = await api.post("/products/", finalProductData);
            // const res = await api.post("/products/", {
            //     ...productForm,
            //     colors: selectedColors.map(c => c.name.toLowerCase())
            // });
            const productId = res.data.id; // Get the ID from the response for upload image using productId
           
            // Upload the Image to product  (only if an image was selected)
            if (productImage && productId) {
                const imageData = new FormData();
                imageData.append("product", productId);
                imageData.append("image", productImage);
                
                // add one image 
                await api.post("/product-images/", imageData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            toast.success("Product added successfully!");
            
            // Reset Forms after creating
            setProductForm(initialFormState);
            setProductImage(null);
            setPreview(null);
            setSelectedColors([])
            e.target.reset();   // Clears the file input field (for image)
            navigate(`/admin/products/${productId}/manage`); 

        } catch (err) {
            toast.error("Failed to add product.");
            console.error("Error adding product:", err.response?.data || err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        // if (window.confirm("Are you sure you want to discard all changes?")) {
            setProductForm(initialFormState); // Resets dropdowns & sizes
            setSelectedColors([]);            // Resets your color list
            setProductImage(null);            // Clears the image
            setPreview(null);                 // Clears the image preview
        // }
    };

    return (


        <Fragment>
            <section className='flex items-center py-4'>
                <h2 className='font-medium text-xl sm:text-2xl text-emerald-800!'>Add Product</h2>
            </section>
            <section>
                <form onSubmit={handleSubmit} onReset={() => {setProductForm(initialFormState);setPreview(null);}} className='grid grid-cols-12 gap-2 sm:gap-4'>
                    <div className='col-span-12 lg:col-span-7 space-y-2 sm:space-y-4'>
                        <h2 className='section-title'> General Information</h2> 
                        <div className='form-section'>
                            <label>Product Name <span className='text-red-600'>*</span></label>
                            <input type="text" name="name" value={productForm.name} onChange={handleChange} placeholder='Name' required autoFocus />
                            <label className='mt-2'>Business Description <span className='text-red-600'>*</span></label>
                            <textarea name='description'value={productForm.description} onChange={handleChange}  placeholder='Description' required rows={7} ></textarea>
                        </div>

                        <h2 className='section-title'>Product Attributes</h2>
                        <div className='form-section'>
                            <label>Category <span className='text-red-600'>*</span></label>
                            <select name="category" value={productForm.category} onChange={handleChange} required>
                                <option value="" disabled>Select Category</option>
                                {categoryOptions.map(opt => 
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>

                            <label className='mt-2'>Sleeve Length <span className='text-red-600'>*</span></label>
                            <select name="sleeve_type" value={productForm.sleeve_type} onChange={handleChange} required>
                                <option value="" disabled>Select Sleeve Type</option>
                                {sleeveOptions.map(opt => 
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>

                            <label className='mt-2'>Style</label>
                            <select name="style" value={productForm.style} onChange={handleChange} >
                                <option value="" disabled>Select Style</option>
                                {styleOptions.map(opt => 
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                {productForm.style && <option value="" className="text-red-600 font-bold">None / Remove</option> }
                            </select>
                            <label className='mt-2'>Prints & Pattern</label>
                            <select name="pattern" value={productForm.pattern} onChange={handleChange} >
                                <option value="" disabled>Select Prints & Pattern</option>
                                {patternOptions.map(opt => 
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                {productForm.pattern && <option value="" className="text-red-600 font-bold">None / Remove</option> }
                            </select>

                            <label className='mt-2'>Neck Style <span className='text-red-600'>*</span></label>
                            <select name="neck_style" value={productForm.neck_style} onChange={handleChange} required>
                                <option value="" disabled>Select Neck Style</option>
                                {(productForm.category === 'tshirt' ? neckOptions : collarOptions).map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>))}
                            </select>
                        </div>

                        <h2 className='section-title'>Sizes & Colors</h2>
                        <div className='form-section'>
                            <div className='flex flex-col'>
                                <label>Available Sizes</label>
                                <div className='flex flex-wrap gap-1 sm:gap-5'>
                                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <button key={size} type="button" onClick={() => handleSizeToggle(size)}
                                        className={`rounded-sm! border border-gray-300 px-4! sm:px-5! w-10 sm:w-12 ${productForm.sizes.includes(size) ? 'bg-white text-black font-semibold' : 'bg-gray-300' }`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className='mt-2'>
                                <div className="flex flex-col gap-1">
                                    <label>Available Colors</label>
                                    <select value="" onChange={handleColor} className="max-w-80">
                                        <option value="" hidden>Select or Add New Color</option>
                                        {globalColors
                                        .filter(gc => !selectedColors.some(sc => sc.name.toLowerCase() === gc.name.toLowerCase()))  // to hide already added colors
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(c => (
                                            <option key={c.name} value={c.name} style={{backgroundColor : c.hex_code,}} className='text-black'>
                                                {c.name.toUpperCase()} — {c.hex_code.toUpperCase()}
                                            </option>
                                        ))}
                                        <option value="ADD_NEW" className="text-blue-600 font-bold">+ Add another Color</option>
                                    </select>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 mt-2 col-span-2">
                                    {selectedColors.map((c, index) => (
                                        <div key={index} className="flex items-center gap-1 border p-1">
                                            <div 
                                                style={{ backgroundColor: c.hex }} 
                                                className="w-5 h-5 rounded-full border border-gray-300" 
                                            />
                                            <span className="text-sm font-medium capitalize">{c.name}</span>
                                            <MdClose type='button' onClick={() => removeColor(c.name)} size={15} className='text-red-500 cursor-pointer' />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal */}
                            {showModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm space-y-4">
                                        <h2 className="text-lg font-bold text-emerald-800!">Create New Color</h2>
                                        
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium">Color Name <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text"
                                                placeholder="Color Name (e.g. Navy Blue)" 
                                                value={tempColor.name} 
                                                onChange={(e) => setTempColor({...tempColor, name: e.target.value})} 
                                                className="w-full border capitalize " autoFocus
                                            />
                                            {/* <p style={{ color: 'red', fontSize: '12px' }}>This field is required</p> */}
                                            <div className="flex items-center gap-3 border p-2 rounded">
                                                <span className="text-sm text-gray-500">Pick Hex:</span>
                                                <input
                                                    type="color"
                                                    value={tempColor.hex} 
                                                    onChange={(e) => setTempColor({...tempColor, hex: e.target.value})}
                                                    className="w-8 h-8 p-0! border-2 border-gray-300 rounded-sm! cursor-pointer align-middle  [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:p-0 [&::-webkit-color-swatch-wrapper]:p-0" 
                                                />
                                                <input type="text" value={tempColor.hex} onChange={(e) => setTempColor({...tempColor, hex: e.target.value})} className='uppercase w-36 sm:w-auto' />
                                                {/* <span className="text-xs uppercase">{tempColor.hex}</span> */}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-black p-2 font-medium"> Cancel</button>
                                            <button onClick={addColor} className="flex-1 btn-primary"> Add & Link</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                    
                        </div>

                    </div>



                    <div className='col-span-12 lg:col-span-5 space-y-2 sm:space-y-4'>
                        <h2 className='section-title flex items-center gap-2'>
                            <span>Product Image</span> 
                            <div className='relative group hidden sm:flex items-center gap-2' tabIndex={0}>
                                <MdOutlineInfo size={20} className='cursor-help'/>
                                <span className='absolute -top-6 w-60 right-0 z-30  hidden group-focus-within:block group-hover:block text-xs bg-black text-white px-2 py-1 rounded '>Use a square 1:1 image for best results.</span>
                            </div>
                        </h2>

                        <div className='form-section gap-3'>
                            <label>Cover Image <span className="text-red-600">*</span></label>
                            <div className='flex flex-wrap items-center flex-row'>
                                <div>
                                    {preview ? 
                                        <div className='group relative image-box shrink-0 overflow-hidden' tabIndex={0}>
                                            <span className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                Cover
                                            </span>
                                            <img src={preview} alt="Selected" className='w-full h-full object-cover transition-all group-hover:scale-105 group-hover:brightness-50'/>
                                            <div className='hidden  group-focus-within:flex group-hover:flex flex-col gap-2 absolute inset-0 h-full w-full items-center justify-center'>
                                                {/* <button type='button' onClick={() => document.getElementById("imageInput").click()} className='bg-white'>Replace</button> */}
                                                <button type='button' onClick={() => {setPreview(null);setProductImage(null);document.getElementById("imageInput").value = ""; }} className='bg-red-500 text-white'>Cancel</button>
                                            </div>
                                        </div>
                                    : 
                                        <div onClick={() => document.getElementById("imageInput").click()} className='image-box shrink-0 border-dashed!'>
                                            <IoMdImages size={28} />
                                            <span className='text-blue-600 hover:underline text-sm text-center'>Click to Upload Cover Image</span>
                                            <span className='block md:hidden text-xs text-center'>Use a square 1:1 image for best results</span>
                                        </div>
                                    }
                                </div>
                                <span className="text-sm text-center text-gray-500 mt-2 sm:mt-0 grow basis-37 min-w-37">💡 Gallery images can be added later from Product Details.</span>

                                <input type="file" id='imageInput' onChange={handleImage} hidden />
                            </div>
                        </div>
                        
                        

                        <h2 className='section-title'>Pricing & Inventory</h2>
                        {/* Pricing & Inventory  , Product Status & Mgt, Variant (size,color) */}
                        <div className='form-section gap-2 grid! grid-cols-2'>
                            <div className='col-span-2 sm:col-span-1 flex flex-col'>
                                <label>Base Price <span className='text-red-600'>*</span></label>
                                <input type="number" min='1' name='price' value={productForm.price} onChange={handleChange} placeholder='0.00' required/>
                            </div>
                            <div className='col-span-2 sm:col-span-1 flex flex-col'>
                                <label>Discount Price</label>
                                <input type="number" min='0' name='discount_price' value={productForm.discount_price} onChange={handleChange} placeholder='0.00' />
                                {parseFloat(productForm.discount_price) > parseFloat(productForm.price) && (
                                    <span className="text-red-500 text-sm">Discount must be less than base price</span>
                                )}
                            </div>
                            <div className='col-span-2 sm:col-span-1 flex flex-col'>
                                <label>Total Stock <span className='text-red-600'>*</span></label>
                                <input type="number" min='0' name='stock' value={productForm.stock} onChange={handleChange} placeholder='0' required />
                            </div>

                            {/* <div className='col-span-2 flex flex-col'>
                                <span className='text-sm mb-2 text-blue-600'>Check to showcase this item in the New Arrivals section.</span>
                                <label className='flex items-center gap-3 cursor-pointer'> 
                                    <input type="checkbox" className="w-5 h-5" name="is_new_arrival" value={productForm.is_new_arrival} onChange={handleChange} />
                                    <span>New Arrival </span>
                                </label>
                            </div> */}
                        </div>
                        
                        <div className='flex gap-2 p-2 mb-2'>
                            <input type="checkbox" className="w-5 h-5" name="is_new_arrival" value={productForm.is_new_arrival} onChange={handleChange} />
                            <span className='text-sm mb-2 text-blue-600'>Check to showcase this item in the New Arrivals section.</span>
                            {/* <span>New Arrival</span> */}
                        </div>

                        <div className='flex justify-between'>
                            <button type='button' onClick={() => setShowDiscardModal(true)} className='btn-primary-outline
                            '>Discard</button>                            
                            <button type="submit" className='btn-primary' disabled={isSubmitting}>
                            {isSubmitting ? "Processing..." : "Add Product"}
                            </button>
                        </div>

                    </div>
                </form>
                 <ConfirmModal
                            isOpen={showDiscardModal}
                            title="Discard?"
                            message="Are you sure you want to discard all changes?"
                            confirmText="Yes"
                            cancelText="No"
                            onConfirm={() => {handleReset(); setShowDiscardModal(false)}}
                            onCancel={() => setShowDiscardModal(false)}
                        />
            </section>
        </Fragment>
    );
}

export default AddProduct;
