import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';


export const ProductContext = createContext()

const ProductProvider = ({children}) => {

    

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);


    
    const fetchProductList = async (url) => {
        setLoading(true);
        try {
            const res = await api.get(url);
            
            console.log('product list fetched successfully');

            return res.data; // Return data for local page use

        } catch (err) {
            console.error("Error fetching products", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // // Debounce search filters
    // useEffect(() => {
    //     const delay = setTimeout(() => {
    //         let url = "/products/?";

    //         if (search) url += `search=${search}&`;
    //         if (category) url += `category=${category}&`;
    //         if (isNew) url += `is_new_arrival=${isNew}&`;

    //         setCurrentUrl(url);
    //     }, 500);
    //     return () => clearTimeout(delay);
    // }, [search, category, isNew]);







    // for admin to update all product fields 
    const updateProductField = async ( id, field, value ,initialValue) => {     

        if (value === initialValue) return ;

        // for to discount price validation 
        if (field === 'price' || field === 'discount_price') {
            // Get the latest values, falling back to the existing product state if not currently being edited
            const basePrice = field === 'price' ? parseFloat(value) : parseFloat(product.price);
            const discountPrice = field === 'discount_price' ? parseFloat(value) : parseFloat(product.discount_price);

            if (discountPrice > basePrice) {
            alert("Discount price cannot be higher than the base price!");
            
            // Reset the input field visual value back to initial if validation fails
            document.querySelector(`input[name=${field}]`).value = initialValue;
            return;
            }
        }
        
        setIsActionLoading(true)
        try {
            await api.patch(`/products/${id}/`, 
                { [field] : value }
            )

            console.log('Updated successfully');
            const fieldOptions = [
                { label: "Neck Style", value: "neck_style" },
                { label: "Sleeve Type", value: "sleeve_type" },
            ];
            const matchedOption = fieldOptions.find(o => field === o.value)

            if (field === 'is_active') {
                toast.success(`Product ${value == true ? 'Activated' : 'Deactivated'}.`)
            } else if (field === 'is_new_arrival'){
                toast.success(`Product ${value === true ? 'Marked as New arrival' : 'Removed from New arrival'}.`)
            } else if (matchedOption) {
                toast.success(`Product ${matchedOption.label} updated.`)
            } else {
                toast.success(`Product ${field.charAt(0).toUpperCase() + field.slice(1)} updated.`);
            }

            fetchProductDetails(id)   // refresh the details
            
            // Decide what to refresh based on where the user is
            // if (refreshType === 'detail') {
            //     await fetchProductDetails(id); 
            // } else {
            //     await fetchProductList();
            // }
            // onBlur={(e) => updateProductField(product.id, 'name', e.target.value, product.name, 'detail'
        } catch (error) {
            console.error(error)
            toast.error("Update failed. Please try again.");
        } finally {
            setIsActionLoading(false)
        }
    }






    // for get single product details
    const fetchProductDetails = async (productId) => {
        setIsDetailsLoading(true);
        setProduct(null)                // for clear the data and show the current data in defaultValue input
        
        try {
            const res = await api.get(`/products/${productId}/`);
            setProduct(res.data);
        } catch(error) {
            console.error(error)
        }finally {
            setIsDetailsLoading(false);
        }
    };

   
    


    const categoryOptions = [
        // { label: "All Categories", value: "" },
        { label: "Linen", value: "linen" },
        { label: "Denim", value: "denim" },
        { label: "Silk", value: "silk" },
        { label: "Casual", value: "casual" },
        { label: "Formal", value: "formal" },
        { label: "T-Shirt", value: "tshirt" }
    ];
    const sleeveOptions = [
        // { label: "All Sleeves", value: "" },
        { label: "Short/Normal Sleeve", value: "short" },
        { label: "Full Sleeve", value: "full" },
        { label: "Five Sleeve (3/4)", value: "three_fourth" },
        // { label: "None / Remove", value: "" }
    ];
    const styleOptions = [
        // { label: "All Styles", value: "" },
        { label: "Vintage", value: "vintage" },
        { label: "Retro", value: "retro" },
        { label: "Modern", value: "modern" },
        { label: "Streetwear", value: "streetwear" },
        // { label: "None / Remove", value: "" }
    ];
    const patternOptions = [
        // { label: "All Patterns", value: "" },
        { label: "Printed", value: "printed" },
        { label: "Solid", value: "solid" },
        { label: "Self-Design", value: "textured" },
        { label: "Embroidered", value: "embroidered" },
        { label: "Checks", value: "checks" },
        { label: "Stripes", value: "stripes" },
        // { label: "None / Remove", value: "" }
    ];
    const collarOptions = [
        // { label: "All Collar Styles", value: "" },
        { label: "Classic Collar", value: "classic" },
        { label: "Button-Down Collar", value: "button_down" },
        { label: "Mandarin/Collarless", value: "mandarin" },
        // { label: "None / Remove", value: "" }
    ];

    const neckOptions = [
        // { label: "All Necklines", value: "" },
        { label: "Round/Crew Neck", value: "round" },
        { label: "V-Neck", value: "v_neck" },
        { label: "Polo Collar", value: "polo" },
        { label: "Henley Neck", value: "henley" }
    ];


    return (
        <ProductContext.Provider value={{ fetchProductList, fetchProductDetails, updateProductField, isDetailsLoading, product,
         categoryOptions, sleeveOptions, styleOptions, patternOptions, collarOptions, neckOptions }}>
            {children}
        </ProductContext.Provider>
    );
}

export default ProductProvider;
