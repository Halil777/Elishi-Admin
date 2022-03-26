export const ProductLimit = 50;

export const productStatuses = [
    {
        value:"1",
        label:"Active",
        color:"#FFFFFF"
    },
    {
        value:"0",
        label:"Passive",
        color:"rgb(255, 93, 93)"
    },
    {
        value:"2",
        label:"Master",
        color:"rgb(7, 185, 255)"
    },
    {
        value:"3",
        label:"Vip",
        color:"rgb(255, 127, 7)"
    },
    {
        value:"4",
        label:"Canceled",
        color:"#c81d25"
    }
];

export const genders = [
    {
        value:1,
        label:"Man"
    },
    {
        value:2,
        label:"Women"
    }
];

export const userStatuses = [
    {
        value:1,
        label:"Active"
    },
    {
        value:0,
        label:"Passive"
    }
];

export const checkStatus=(status)=>{
    const res = productStatuses.filter(item=>item.value==status);
    return res[0];
}

export const checkUserStatus=(status)=>{
    const res = userStatuses.filter(item=>item.value==status);
    return res[0];
}

export const checkGender=(gender)=>{
    const res = genders.filter(item=>item.value==gender);
    return res[0];
}



export const event_types = [
    {
        value:1,
        type: "user"
    },
    {
        value:2,
        type: "single_product"
    },
    {
        value:3,
        type: "products"
    },
    {
        value:4,
        type: "category"
    },
    {
        value:5,
        type: "constant"
    },
    {
        value:6,
        type: "sub_category"
    }
];

export const ads_status= [
    {
        value:1,
        label:"home_large"
    },
    {
        value:2,
        label:"home_mini"
    },
    {
        value:3,
        label:"products"
    },
    {
        value:4,
        label:"product_large"
    },
    {
        value:5,
        label:"product_large"
    },
    {
        value:6,
        label:"hidden"
    }
];

export const androidVersionType = `androidVersion`;
export const iosVersionType = `iosVersion`;
export const androidVersionRequired = 'androidVersionRequirement';
export const iosVersionRequired = 'iosVersionRequirement';