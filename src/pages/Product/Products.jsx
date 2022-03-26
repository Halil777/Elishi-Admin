import { Button, FormControlLabel, FormHelperText, IconButton, OutlinedInput, TextField } from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import ProductsTable from './ProductsTable';
import { styled } from '@mui/material/styles';
import FileBrowse from '../FileBrowse/FileBrowse';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { useEffect } from 'react';
import { ProductLimit, productStatuses } from '../Constants/Constant.mjs';
import Compress from 'compress.js';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
    height: '90%',
    display: 'block'
};

const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4
};

const Input = styled('input')({
    display: 'none',
});

function Products() {
    const [open, setOpen] = React.useState(false);
    const [filterOpenState, setFilterOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const filterOpen = () => setFilterOpen(true);
    const filterClose = () => setFilterOpen(false);
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [page_count, setPageCount] = useState('');
    const [user, setUser] = useState('');
    const [status, setStatus] = useState(1);
    const [sub_category, setSubCategory] = useState('');
    const [phone, setPhone] = useState('');
    const [desc, setDesc] = useState('');
    const [size, setSize] = useState('');
    const [first_large_image, setFirstLargeImage] = useState('');
    const [first_small_image, setFirstSmallImage] = useState([]);
    const [sliderSmallImages, setSliderSmallImages] = useState([]);
    const [sliderLargeImages, setSliderLargeImages] = useState('');
    const [isPopular, setPopular] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [productList, setProductList] = useState([]);
    const [isEmptyPage, setEmptyPage] = useState(false);
    const [image, setImage] = useState('Select first image');
    const [imageCount, setImageCount] = useState('Select slider images');
    const [userList, setUserList] = useState([]);
    const [isFirst, setIsFirst] = useState(true);
    const handleClick = () => {

        addProduct();
    }

    const handleFileInput = (e) => {
        setImage(e.target.files[0].name);
        setFirstLargeImage(e.target.files[0]);
        compressFirstImage(e.target.files);
    }
    const handleSliderInput = (e) => {
        setImageCount(e.target.files.length + " file selected");
        setSliderLargeImages(e.target.files);
        compressSliderImages(e.target.files);
    }

    useEffect(() => {
        getSelectCategory();
        getUsers();
    }, [])
    const [selectCategory, setSelectCategory] = useState('');
    const [selectStatus, setSelectStatus] = useState('');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');

    const getSelectCategory = () => {
        AxiosInstance.get('/sub-category/get-sub-category?category_id=')
            .then(response => {
                if (!response.data.error) {
                    setSubCategories(response.data.body);
                } else {
                    showError("Something went wrong!");

                }
            })
            .catch(error => {
                showError(error + "");
            })
    }

    useEffect(() => {
        if(!isFirst)
            getProducts(1);
    }, [selectCategory]);

    useEffect(() => {
        if(!isFirst)
            getProducts(1);
    }, [selectStatus]);

    useEffect(() => {
        if(!isFirst)
            getProducts(1);
    }, [startDate]);

    useEffect(() => {
        if(!isFirst)
            getProducts(1);
    }, [endDate]);

    useEffect(() => {
        if(isFirst)
            getProducts(1);
    },[])


    const getUsers = () => {
        AxiosInstance.get('/user/get-all-users')
            .then(response => {
                if (!response.data.error) {
                    setUserList(response.data.body);
                } else {
                    showError("Something went wrong!");

                }
            })
            .catch(error => {
                showError(error + "");
            })
    }

    const getProducts = (page) => {
        setIsFirst(false);
        let url = '/product/get-product';
        const body = {
            limit: ProductLimit,
            page: page,
            sub_category: selectCategory,
            status: selectStatus,
            start_date: startDate,
            end_date: endDate
        }
        AxiosInstance.post(url, body)
            .then(response => {
                if (!response.data.error) {
                    setProductList(response.data.body.product);
                    if (page == 1)
                        setPageCount(response.data.body.page_count)
                    if (typeof response.data.body.product === 'undefined' || response.data.body.product.length == 0) {
                        setEmptyPage(true);
                    } else {
                        setEmptyPage(false);
                    }
                } else {
                    showError("Something went wrong!");
                    if (productList.length == 0) {
                        setEmptyPage(true);
                    }

                }
            })
            .catch(error => {
                showError(error + "");
                if (productList.length == 0) {
                    setEmptyPage(true);
                }
            })
    }


    const clearInput = () => {
        setName('');
        setPrice('');
        setUser('');
        setStatus(1);
        setSubCategory('');
        setPhone('');
        setDesc('');
        setSize('');
        setFirstLargeImage([]);
        setFirstSmallImage([]);
        setSliderSmallImages([]);
        setSliderLargeImages([]);
        setPopular(false);
        setImage('Select first image');
        setImageCount('Select slider images');
    }

    const compress = new Compress();
    function compressSliderImages(fls) {
        const files = [...fls]
        compress.compress(files, {
            size: 1, // the max size in MB, defaults to 2MB
            quality: .10, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
            rotate: false, // See the rotation section below
        }).then((results) => {
            let compressedArray = [];
            for (let i = 0; i < results.length; i++) {
                const img1 = results[i]
                const base64str = img1.data
                const imgExt = img1.ext
                const file = Compress.convertBase64ToFile(base64str, imgExt);
                compressedArray.push(file);
            }
            setSliderSmallImages(compressedArray);
        })
    }

    function compressFirstImage(fls) {
        const files = [...fls]
        compress.compress(files, {
            size: 1, // the max size in MB, defaults to 2MB
            quality: .10, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
            rotate: false, // See the rotation section below
        }).then((results) => {
            const img1 = results[0]
            const base64str = img1.data
            const imgExt = img1.ext
            const file = Compress.convertBase64ToFile(base64str, imgExt);
            setFirstSmallImage(file);
        })
    }

    const addProduct = () => {
        if (name == '' || price == '' || sub_category == '' || user == '' || first_large_image == '' || first_small_image == '') {
            showWarning("Enter all required information");
            return;
        }
        setLoading(true);
        let formData = new FormData();
        formData.append('first_image_large', first_large_image);
        formData.append('first_image_small', first_small_image);
        formData.append('name', name);
        formData.append('price', price);
        formData.append('size', size);
        formData.append('status', status);
        formData.append('sub_category', sub_category);
        formData.append('phone_number', phone);
        formData.append('description', desc);
        formData.append('user', user);
        formData.append('isPopular', isPopular);
        if (sliderLargeImages.length > 0 && sliderSmallImages.length > 0) {
            for (let k = 0; k < sliderLargeImages.length; k++) {
                formData.append('sliders_large', sliderLargeImages[k]);
                formData.append('sliders_small', sliderSmallImages[k]);
            }
        }
        AxiosInstance.post('/product/add-product', formData)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully added!");
                    setLoading(false);
                    clearInput();
                    handleClose();
                    getProducts(1)
                } else {
                    showError("Something went wrong!");
                    setLoading(false);
                }
            })
            .catch(error => {
                showError(error + "");
                setLoading(false);
            })
    }

    return (
        <div>
            <ToastContainer />
            <Stack
                direction={'column'}
                spacing={4}
            >

                {/* Filters start */}

                <Grid container spacing={1}>


                    <Grid item lg={10} xs={12}>
                        <Stack
                            direction={'column'}
                            spacing={2}
                        >
                        <Button style={{"width":"120px","text-align": "left"}} onClick={filterOpen} startIcon={<FilterAltOutlinedIcon />}>
                            filter
                        </Button>
                        <Stack direction="row" spacing={1}>
                            {
                                selectCategory!=''?
                                <Chip color="success" label={"Category: "+selectCategory} variant="outlined" onDelete={()=>setSelectCategory('')} />
                                :
                                null
                            }
                            {
                                selectStatus!=''?
                                <Chip color="success" label={"Status: "+selectStatus} variant="outlined" onDelete={()=>setSelectStatus('')} />
                                :
                                null
                            }
                            {
                                startDate!=''?
                                <Chip color="success" label={"Start date: "+startDate} variant="outlined" onDelete={()=>setStartDate('')} />
                                :
                                null
                            }
                            {
                                (endDate!='' && startDate!='')?
                                <Chip color="success" label={"End date: "+startDate} variant="outlined" onDelete={()=>setEndDate('')} />
                                :
                                null
                            }
                        </Stack>
                        </Stack>
                    </Grid>

                    {/* Add product button */}
                    <Grid item lg={2} xs={12}>
                        <Stack
                            direction={'row'}
                            spacing={4}
                            justifyContent={'flex-end'}
                        >
                            <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add Products</Button>
                        </Stack>
                    </Grid>
                    {/* Add product button end */}

                </Grid>
                {/* Filters end */}




                <ProductsTable subCategories={subCategories} userList={userList} page_count={page_count} productList={productList} isEmptyPage={isEmptyPage} getProducts={getProducts} />
            </Stack>


            {/* Modal for add */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack
                        direction={"column"}
                        spacing={3}
                    >
                        <Stack
                            direction={'row'}
                            justifyContent={'flex-end'}
                        >
                            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                        </Stack>
                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Product name"
                                    defaultValue=""
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Price"
                                    defaultValue=""
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    id="outlined-required"
                                    label="Size"
                                    defaultValue=""
                                    value={size}
                                    onChange={e => setSize(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        input={<OutlinedInput label="Status" />}
                                    >
                                        {
                                            productStatuses.map((st) => {
                                                return (
                                                    <MenuItem
                                                        key="Active"
                                                        value={st.value}
                                                    >
                                                        {st.label}
                                                    </MenuItem>
                                                )
                                            })
                                        }



                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">Sub Category</InputLabel>
                                    <Select
                                        value={sub_category}
                                        onChange={e => setSubCategory(e.target.value)}
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        input={<OutlinedInput label="Sub category" />}
                                    >
                                        {
                                            subCategories.map((element, i) => {
                                                return (
                                                    <MenuItem key={i} value={element.id}>
                                                        {element.sub_category_name_tm}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    id="outlined-required"
                                    label="Phone number"
                                    defaultValue=""
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>

                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">Select user:</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={user}
                                        onChange={e => setUser(e.target.value)}
                                        input={<OutlinedInput label="User" />}
                                    >
                                        {
                                            userList.map((user, i) => {
                                                return (
                                                    <MenuItem
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.fullname}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} lg={6}>
                                <FormControlLabel style={{ marginLeft: '5px' }} control={<Checkbox checked={isPopular}
                                    onChange={e => setPopular(!isPopular)} />} label="isPopular" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={12}>
                                <TextField
                                    fullWidth
                                    id="filled-textarea"
                                    label="Description"
                                    placeholder="Enter Description..."
                                    multiline
                                    rows={4}
                                    variant="filled"
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}

                                />
                            </Grid>

                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={12} lg={12}>
                                <label htmlFor="contained-button-file3">
                                    <Input accept="image/*" id="contained-button-file3" type="file" onChange={handleFileInput} />
                                    <FileBrowse component="span" image={image}>
                                    </FileBrowse>
                                </label>
                            </Grid>
                            <Grid item md={12} lg={12}>
                                <label htmlFor="contained-button-file2">
                                    <Input accept="image/*" id="contained-button-file2" type="file" multiple onChange={handleSliderInput} />
                                    <FileBrowse component="span" image={imageCount}>
                                    </FileBrowse>
                                </label>
                            </Grid>

                            <Grid item md={12} lg={12}>
                                {
                                    <LoadingButton
                                        loading={isLoading}
                                        loadingPosition="start"
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        fullWidth={true}
                                        onClick={handleClick}
                                    >
                                        {isLoading ? <p style={{ color: "white" }}>Please wait...</p> : <p style={{ color: "white" }}>Add</p>}
                                    </LoadingButton>

                                }

                            </Grid>

                        </Grid>


                    </Stack>
                </Box>
            </Modal>
            {/* End of modal add */}

            <Modal
                open={filterOpenState}
                onClose={filterClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style2}>
                    {/* Filters start */}
                    <Stack
                        direction={"column"}
                        spacing={1}
                    >
                      
                    <Grid container spacing={1}>
                        <Grid container>
                                <Grid item lg={11}></Grid>
                                <Grid item lg={1}>
                                    <IconButton onClick={filterClose}><CloseIcon /></IconButton>
                                </Grid>
                        </Grid>
                        <Grid item lg={12} xs={12}>

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-helper-label">Sub Category filter</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={selectCategory}
                                    label="Sub Category filter"
                                    onChange={e => setSelectCategory(e.target.value)}
                                >
                                    <MenuItem key="" value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        subCategories.map((element, i) => {
                                            return (
                                                <MenuItem key={i} value={element.id}>
                                                    {element.sub_category_name_tm}
                                                </MenuItem>
                                            )
                                        })
                                    }

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item lg={12} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-helper-label2">Status filter</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label2"
                                    id="demo-simple-select-helper2"
                                    value={selectStatus}
                                    label="Status filter"
                                    onChange={e => setSelectStatus(e.target.value)}
                                >
                                    <MenuItem key="" value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        productStatuses.map((st) => {
                                            return (
                                                <MenuItem
                                                    key="Active"
                                                    value={st.value}
                                                >
                                                    {st.label}
                                                </MenuItem>
                                            )
                                        })
                                    }

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item lg={12} xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={3}>
                                    <MobileDatePicker
                                        mask='__/__/____'
                                        label="Start date"
                                        value={startDate}
                                        inputFormat="dd/MM/yyyy"
                                        onChange={(newValue) => {
                                            setStartDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Stack>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={3}>
                                    <MobileDatePicker
                                        mask='__/__/____'
                                        label="End date"
                                        value={endDate}
                                        inputFormat="dd/MM/yyyy"
                                        onChange={(newValue) => {
                                            setEndDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Stack>
                            </LocalizationProvider>
                        </Grid>

                        

                    </Grid>
                    {/* Filters end */}
                    </Stack>
                </Box>

            </Modal>
        </div>
    )
}

export default Products

