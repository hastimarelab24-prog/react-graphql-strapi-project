    const applyDiscount=(price,discount)=>{
        let currentPrice=Number(price||0);
        // discountprice active not to be orifinal price return
        if(!discount?.isActive){
            return currentPrice;
        }

        const value=Number(discount.discountValue || 0);

        if(!Number.isFinite(value) || value <0){
            return currentPrice;
        }

        // percentage discount
        if(discount.discountType === "percentage") {
            const percentage = Math.min(value,100);

            currentPrice = currentPrice -(currentPrice*percentage)/100;
        }
        // fixed discount
        if(discount.discountType === "fixed"){
            currentPrice = currentPrice - value;
        }
        return Math.max(0,currentPrice);
    }


    export const getDiscountedPrice = (price, globalOffer, categoryDiscount,productDiscount) => {
   
        let finalPrice = Number(price || 0);

    //   global offer active apply

    finalPrice=applyDiscount(finalPrice,globalOffer);
    
    // categroy discount active apply
   
        finalPrice =applyDiscount(finalPrice,categoryDiscount);
    

    // product discount active apply
  
        finalPrice= applyDiscount(finalPrice,productDiscount);

    return Number(Math.max(0,finalPrice).toFixed(2))
    };
    