import React, { useState,useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { confirm } from "react-confirm-box";
import './productstable.css';
import { Modal, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { OutlinedInput, TextField, FormControlLabel } from '@mui/material'
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import { data } from '../../constants';
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { server_ip } from '../Axios/AxiosInstance';
import FileBrowse from '../FileBrowse/FileBrowse';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import Compress from 'compress.js';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import DownloadIcon from '@mui/icons-material/Download';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import { checkStatus, productStatuses } from '../Constants/Constant.mjs';
import AddIcon from '@mui/icons-material/Add';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'white',
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
    bgcolor: 'white',
    border: '2px solid transparent',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4
};


const Input = styled('input')({
    display: 'none',
});

const ProductsTable = ({ subCategories, productList, isEmptyPage, getProducts, page_count, userList }) => {
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);
    const [eventOpen, setEventOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const handleEventClose = () => setEventOpen(false);
    const [page, setPage] = React.useState(1);

    const handleEventOpen=()=>{
        setEventOpen(true);
    }

    const [checkedProducts,setCheckedProducts] = useState([]);


    const addCheckedProduct = (id) =>{
        let temp = [...checkedProducts,id];
        setCheckedProducts(temp);
    }

    const removeCheckedProduct = (id) => {
        let temp = checkedProducts.filter(checkedProduct => checkedProduct!=id);
        setCheckedProducts(temp);
    }

    const getIsChecked=(id)=>{
        let temp = checkedProducts.filter(checkedProduct => checkedProduct==id);
        if(temp.length > 0){
            return true;
        } else {
            return false;
        }
    }

    const setChecked=(e,id)=>{
        if(e.target.checked)
            addCheckedProduct(id);
        else
            removeCheckedProduct(id);
    }
    // Product vars
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [user, setUser] = useState('');
    const [status, setStatus] = useState(1);
    const [sub_category, setSubCategory] = useState('');
    const [phone, setPhone] = useState('');
    const [desc, setDesc] = useState('');
    const [size, setSize] = useState('');
    const [first_large_image, setFirstLargeImage] = useState('');
    const [first_small_image, setFirstSmallImage] = useState([]);
    const [sliderSmallImages, setSliderSmallImages] = useState([]);
    const [allImages, setAllImages] = useState([]);
    const [sliderLargeImages, setSliderLargeImages] = useState('');
    const [isPopular, setPopular] = useState(false);
    const [id, setId] = useState(0);
    const [image, setImage] = useState('Select first image');
    const [imageCount, setImageCount] = useState('Select slider images');
    const [cancel_reason, setCancelReason] = useState('');
    // --- //

    const clearInput = () => {
        setName('');
        setPrice('');
        setUser('');
        setStatus(1);
        setId(0);
        setSubCategory('');
        setPhone('');
        setDesc('');
        setSize('');
        setFirstLargeImage([]);
        setFirstSmallImage([]);
        setSliderSmallImages([]);
        setSliderLargeImages([]);
        setAllImages([]);
        setPopular(false);
        setCancelReason('');
        setImage('Select first image');
        setImageCount('Select slider images');
    }
    const handleOpen = (element) => {
        setOpen(true);
        setId(element.id);
        setName(element.product_name);
        setPrice(element.price);
        setUser(element.user_id);
        setStatus(element.status);
        setSubCategory(element.sub_category_id);
        setPhone(element.phone_number);
        setDesc(element.description);
        setSize(element.size);
        setPopular(element.is_popular);
        setImage(getFirstImage(element.images));
        setAllImages(element.images);
        setCancelReason(element.cancel_reason);
        setImageCount(element.images.length - 1 + " image selected");
    };
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



    const handleChange = (event, value) => {
        setPage(value);
        getProducts(value);
    };

    const [isLoading, setLoading] = useState(false);
    const [isLoadingEvent, setLoadingEvent] = useState(false);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateProduct();
    }





    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this product?")) {
            deleteProduct(element);
        }
    };

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

    const deleteProduct = async (element) => {
        AxiosInstance.delete('/product/delete-product/' + element.id)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully deleted!");
                    getProducts(page);
                } else {
                    showError("Something went wrong!");
                }
            })
            .catch(err => {
                showError(err + "");
            })
    }

    const updateProduct = () => {
        if (name == '' || price == '' || sub_category == '' || user == '' || id == 0) {
            showWarning("Enter all required information");
            return;
        }
        setLoading(true);
        let formData = new FormData();
        if (first_large_image != '') {
            formData.append('first_image_large', first_large_image);
            formData.append('first_image_small', first_small_image);
        }
        let reason = cancel_reason;
        if(status!=4){
            reason = '';
        }
        formData.append('id', id);
        formData.append('name', name);
        formData.append('price', price);
        formData.append('size', size);
        formData.append('status', status);
        formData.append('sub_category', sub_category);
        formData.append('phone_number', phone);
        formData.append('description', desc);
        formData.append('user', user);
        formData.append('isPopular', isPopular);
        formData.append('cancel_reason', reason);
        if (sliderLargeImages.length > 0 && sliderSmallImages.length > 0) {
            for (let k = 0; k < sliderLargeImages.length; k++) {
                formData.append('sliders_large', sliderLargeImages[k]);
                formData.append('sliders_small', sliderSmallImages[k]);
            }
        }
        AxiosInstance.put('/product/update-product', formData)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully updated!");
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

    const getFirstImage = (images) => {
        let tempImgs = images.filter(img => img.is_first == true);
        if (typeof tempImgs === 'undefined' || tempImgs.length == 0 || tempImgs == null) {
            return '';
        }
        return tempImgs[0].small_image;
    }


    const [events,setEvents]=useState([]);
    const [selectedEvent,setSelectedEvent]=useState('');
    const getEvents = () => {
        AxiosInstance.get('/event/get-event')
        .then(response=>{
            setEvents(response.data.body);
        })
        .catch(err => {
            console.log(err+"");
        })
    }

    
    const handleClickEvent=()=>{
        addProductsToEvent();
    }

    const addProductsToEvent=()=>{
        if(selectedEvent=='' || checkedProducts.length==0){
            showWarning("Please enter required information");
            return;
        }
        setLoadingEvent(true);
        AxiosInstance.post('/event/add-product-to-event',{
            event_id:selectedEvent,
            produscts:checkedProducts
        })
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully added!");
                setLoadingEvent(false);
                setSelectedEvent('');
                handleEventClose();
                getProducts(page);
            } else {
                showError("Something went wrong!");
                setLoadingEvent(false);
            }
        })
        .catch(error => {
            showError(error + "");
            setLoadingEvent(false);
        })
    }

    useEffect(()=>{
        getEvents();
    },[]);

    return (
        <div>
            {((typeof productList === 'undefined' || productList.length <= 0) && !isEmptyPage) ? <Loading /> : ((typeof productList === 'undefined' || productList.length <= 0) && isEmptyPage) ? <Empty /> :
                <div>
                    <Grid container spacing={2}>
                        <Grid item lg={6} sm={12}>
                            <Stack direction={'row'} spacing={6}>
                                    {
                                        productStatuses.map((item,i)=>{
                                            return(
                                                <span>
                                                    <label>{item.label}:</label><br/>
                                                    <div className="statusGuide" style={{background:item.color}}>
                                                    </div> 
                                                </span>
                                            )
                                        })
                                    }
                                
                            </Stack>
                        </Grid>
                    <Grid item lg={6} sm={12}>
                        <Stack direction={'row'} justifyContent={'flex-end'} alignItems={'flex-end'}>
                            <Button variant="text" color="error" onClick={handleEventOpen}>Add to event</Button>  
                        </Stack>
                    </Grid>
                    </Grid>
                    <br/>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                       
                                    </TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell align="left">Product image</TableCell>
                                    <TableCell align="left">Product name</TableCell>
                                    <TableCell align="left">Price</TableCell>
                                    <TableCell align="left">Size</TableCell>
                                    <TableCell align="left">Category</TableCell>
                                    <TableCell align="left">User</TableCell>
                                    <TableCell align="left">User type</TableCell>
                                    <TableCell align="left">Product limit</TableCell>
                                    <TableCell align="left">Phone number</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="left">DELETE</TableCell>
                                    <TableCell align="left">EDIT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    productList.map((element, i) => {
                                        let color=checkStatus(element.status).color;
                                        return (
                                            <TableRow
                                                style={{ background:color}}
                                                key={element.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0} }
                                            }
                                            >
                                                <TableCell align="left">
                                                <Checkbox defaultChecked={getIsChecked(element.id)}
                                                    onChange={e => setChecked(e,element.id)}
                                                    />

                                                </TableCell>
                                                <TableCell component="th" scope="row">{element.id}</TableCell>
                                                <TableCell align="left">{element.images != null ? <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + getFirstImage(element.images)} className="img" />
                                                    : <img src={data.user.placeholder} className="img" />
                                                }</TableCell>
                                                <TableCell align="left">{element.product_name}</TableCell>
                                                <TableCell align="left">{element.price} TMT</TableCell>
                                                <TableCell align="left">{element.size}</TableCell>
                                                <TableCell align="left">{element.sub_category_name_en}</TableCell>
                                                <TableCell align="left">{element.fullname}</TableCell>
                                                <TableCell align="left">{element.user_type}</TableCell>
                                                <TableCell align="left">{(element.product_limit<0)?<label>Unlimited</label>:element.product_limit}</TableCell>
                                                <TableCell align="left">{element.user_phone_number}</TableCell>
                                                <TableCell align="left">{checkStatus(element.status).label}</TableCell>
                                                <TableCell align="left"> <IconButton aria-label="delete" color="secondary" onClick={() => confirmDialog(element)}><DeleteIcon /></IconButton></TableCell>
                                                <TableCell align="left"> <IconButton aria-label="delete" color="success" onClick={() => handleOpen(element)}><EditIcon /></IconButton></TableCell>
                                            </TableRow>
                                        )
                                    })
                                }



                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br />
                    <Stack direction={"row"} justifyContent={"center"}>
                        <Pagination
                            page={page}
                            onChange={handleChange}
                            count={page_count}
                            color="primary" />
                    </Stack>
                </div>
            }




            {/* Modal for edit */}
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
                                    type="number"
                                    defaultValue=""
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
                            {
                                status==4?
                                <Grid item xs={12} lg={12}>
                                <TextField
                                    fullWidth
                                    id="filled-textarea"
                                    label="Cancel reason"
                                    placeholder="Enter cancel reason..."
                                    multiline
                                    rows={4}
                                    variant="filled"
                                    value={cancel_reason}
                                    onChange={e => setCancelReason(e.target.value)}

                                />
                            </Grid>
                            :
                            null
                            }

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
                                        startIcon={<EditIcon />}
                                        variant="contained"
                                        fullWidth={true}
                                        onClick={handleClick}
                                    >
                                        {isLoading ? <p style={{ color: "white" }}>Please wait...</p> : <p style={{ color: "white" }}>Edit</p>}
                                    </LoadingButton>

                                }

                            </Grid>

                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={12}>
                                <ImagesListComponent setImageCount={setImageCount} setAllImages={setAllImages} getProducts={getProducts} page={page} itemData={allImages} />
                            </Grid>
                        </Grid>



                    </Stack>
                </Box>
            </Modal>
            {/* End of modal edit */}


            <Modal
                open={eventOpen}
                onClose={handleEventOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style2}>
                    <Stack
                        direction={"column"}
                        spacing={3}
                    >
                        
                        <Grid container spacing={2}>
                        <Grid container>
                            <Grid item lg={11}></Grid>
                            <Grid item lg={1}>
                                <IconButton onClick={handleEventClose}><CloseIcon /></IconButton>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {
                                checkedProducts.length>0?
                                <label>{checkedProducts.length} products selected</label>
                                :
                                <label style={{color:'red'}}>0 products selected</label>
                            }
                        </Grid>
                        <Grid item xs={12} lg={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">Select event:</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={selectedEvent}
                                        onChange={e => setSelectedEvent(e.target.value)}
                                        input={<OutlinedInput label="Event" />}
                                    >
                                        {
                                            events.map((event, i) => {
                                                return (
                                                    event.event_type=='products'?
                                                    <MenuItem
                                                        key={event.id}
                                                        value={event.id}
                                                    >
                                                        {event.title_tm}
                                                    </MenuItem>: null
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} lg={12}>
                               
                            {
                                checkedProducts.length>0?
                                <LoadingButton
                                    loading={isLoadingEvent}
                                    loadingPosition="start"
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    fullWidth={true}
                                    onClick={handleClickEvent}
                                >
                                    {isLoading ? <p style={{ color: "white" }}>Please wait...</p> : <p style={{ color: "white" }}>Add</p>}
                                </LoadingButton>
                                :
                                <LoadingButton
                                    loading={isLoadingEvent}
                                    loadingPosition="start"
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    fullWidth={true}
                                    disabled
                                    onClick={handleClickEvent}
                                >
                                    {isLoading ? <p style={{ color: "white" }}>Please wait...</p> : <p style={{ color: "white" }}>Add</p>}
                                </LoadingButton>
                            }

                            </Grid>
                        </Grid>



                    </Stack>
                </Box>
            </Modal>
        </div>
    )
}

export const ImagesListComponent = ({ itemData, getProducts, page,setAllImages,setImageCount }) => {
    const handleClick = (img1, img2) => {
        window.open(img1);
        window.open(img2);
    };
    const handleDelete = (item) => {
        if (window.confirm("Do you want delete this image?")) {
            deleteImage(item);
        }
    }

    const deleteItem = (id) => {
        let tmp= itemData.filter((item, i) => item.id !== id);
        setAllImages(tmp);
        setImageCount((tmp.length-1)+" image selected");
      };

    const deleteImage = (item) => {
        AxiosInstance.delete('/product/delete-product-image/' + item.id + '?small=' + item.small_image + '&large=' + item.large_image)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully deleted!");
                    getProducts(page);
                    deleteItem(item.id);
                } else {
                    showError("Something went wrong!");
                }
            })
            .catch(error => {
                showError(error + "");
            })
    }
    return (
        <ImageList sx={{}}>
            <ImageListItem key="Subheader" cols={2}>
                <ListSubheader component="div">All images</ListSubheader>
            </ImageListItem>
            {itemData.map((item) => (
                <ImageListItem key={item.img}>
                    <img
                        src={server_ip + `/${item.small_image}?w=248&fit=crop&auto=format`}
                        srcSet={server_ip + `/${item.small_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.is_first}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        title={item.is_first}
                        subtitle={item.is_first}
                        actionIcon={
                            <Stack direction={'row'}>
                                <IconButton
                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                    aria-label={`info about ${item.is_first}`}
                                >
                                    <DeleteIcon onClick={() => handleDelete(item)} />
                                </IconButton>
                                <IconButton
                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                    aria-label={`info about ${item.is_first}`}
                                >
                                    <DownloadIcon onClick={() => handleClick(server_ip + "/" + item.small_image, server_ip + "/" + item.large_image)} />
                                </IconButton>
                            </Stack>

                        }
                    />

                </ImageListItem>
            ))}
        </ImageList>
    );
}

export default ProductsTable
