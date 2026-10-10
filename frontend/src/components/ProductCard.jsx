import React, { Fragment, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import  placeholderImage from '../assets/PlaceholderImage.png';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa6';
import { FaRegHeart } from 'react-icons/fa';

const ProductCard = ({product}) => {

    const navigate = useNavigate()


    return (
        <Fragment>
            {/* {productList.map( p => ( */}
                <div onClick={() => navigate(`/products/${product.id}`)} className='w-full sm:w-56 lg:w-72 p-2 lg:p-4 shrink-0 bg-white cursor-pointer rounded-3xl shadow group transition-all hover:-translate-y-1'>
                    <div className='relative overflow-hidden rounded-2xl bg-linear-to-t from-gray-200 from-60% to-gray-500 border border-gray-200'>
                        <img src={product.images?.[0]?.image || placeholderImage} 
                            className='w-full aspect-auto object-cover transition-all group-hover:scale-110 group-hover:brightness-95' style={{aspectRatio: 4 / 5}}/>
                        {product.is_new_arrival && (
                            <div className="absolute top-2 lg:top-3 left-0 -rotate-45 -translate-x-5 lg:-translate-x-6 bg-[#f5f2eb] text-emerald-800 text-[10px] lg:text-xs font-bold px-7 lg:px-8 py-1">
                                NEW
                            </div>
                        )}
                    </div>
                    <div className='mt-2 lg:mt-4'>
                        <div className='flex justify-between items-center'>
                            <div className="text-[10px] sm:text-xs font-semibold capitalize rounded-lg text-white bg-emerald-700 w-fit px-3 py-1 shrink-0">
                                { product.category}
                            </div>
                            <FaRegHeart  className='text-black text-lg sm:text-xl' />
                        </div>
                        <h2 className='font-semibold capitalize text-black text-sm lg:text-lg line-clamp-2 h-10 lg:h-14' title={product.name}>{product.name}</h2>
                        {/* <div className='flex gap-2 mt-3 items-center'>
                            <p className='flex flex-col'>
                                <span className='text-sm'>Price</span>
                                <span className='font-bold text-black text-lg min-w-20'>${product.price}</span>
                            </p>

                            <button onClick={() => navigate(`/products/${product.id}`)} className='btn-primary rounded-full! w-full'>View Product</button> 
                        </div> */}
                        <div className='space-x-2 mt-2'>
                            {product.discount_price && 
                                <span className='font-semibold text-black text-sm lg:text-xl min-w-20'>${product.discount_price}</span>
                            }
                            <span className={`${!product.discount_price ? 'text-black' : 'line-through text-gray-500'} font-semibold text-sm lg:text-xl`}>${product.price}</span>
                        </div>
                    </div> 
                </div>
            {/* ))} */}
        </Fragment>
    );
}

export default ProductCard;
