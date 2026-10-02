import React, { useCallback, useEffect, useState } from 'react'
import { data } from 'react-router-dom';
const API_URL = "http://localhost:1337";

// get the logged in user token
const getHeaders = ()=>{
    const token = localStorage.getItem("token");

    if(!token){
        throw new Error ("plaese login before manging global offer.")
    }

    return{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json",
    }
}


 const useGlobalOffer = () => {
    const[offer,setOffer] = useState(null);
    const [loading,setLoading]=useState(true);
    const[saving,setSaving]=useState(false);
    const [error,setError]=useState("");

    const fetchOffer = useCallback(async ()=>{
        try{
            setError("");
            const response = await fetch(`${API_URL}/api/global-offer`,{
                method:"GET",
                headers:getHeaders(),
            })

            const result = await response.json();

            if(!response.ok){
                throw new Error(result?.error?.message || "unable to load golbal offer")
            }

            // offer strapi response formate
            const offerData = result?.data?.attributes || result?.data || null;
            setOffer(offerData);
            return offerData;
        }
        catch(err){
            console.error("Golbal offer fetch error:",err);
            setError(err.message);
            return null;
            
        }finally{
            setLoading(false)
        }
    },[])


    // update global offer in strapi
    const saveOffer = async (formData)=>{
        try{
            setSaving(true);
            setError("");
            const response = await fetch(`${API_URL}/api/global-offer`,{
                method:"PUT",
                headers:getHeaders(),
                body:JSON.stringify({
                    data:{
                        name:formData.name.trim(),
                        isActive:formData.isActive,
                        discountType:formData.discountType,
                        discountValue:Number(formData.discountValue),
                    }
                })
            })

            const result = await response.json();

            if(!response.ok){
                throw new Error (result?.error?.message || "unable to save golbal offer.")
            }
            const updatedOffer = result?.data?.attributes || result?.data || formData;

            setOffer(updatedOffer);
            return updatedOffer;
        }catch(err){
            console.error("Global offer save error:",err);
            setError(err.message);
            throw err;
            
        }finally{
            setSaving(false);
        }
    }


    // initial fetch and refersh every 5 secounds
    useEffect(()=>{
        fetchOffer();
        const interval = setInterval(()=>{
            fetchOffer()
        },5000);

        return ()=>clearInterval(interval)
    },[fetchOffer])
  return {offer,loading,saving,error,fetchOffer,saveOffer}
}
export default useGlobalOffer;