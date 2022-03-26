import React, { useState } from 'react'
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
import './users.css';
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
import { AxiosInstance, server_ip } from '../Axios/AxiosInstance';
import { checkGender, checkStatus,userStatuses,genders, productStatuses } from '../Constants/Constant.mjs';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import FileBrowse from '../FileBrowse/FileBrowse';
import Compress from 'compress.js';

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

const Input = styled('input')({
    display: 'none',
});

const UsersTable = ({ getUsers, userTypes, isEmptyPage, districts, users,page_count }) => {
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);
   
    const handleClose = () => setOpen(false);
    const [page, setPage] = React.useState(1);
    const [isLoading, setLoading] = useState(false);
    const [changeStatus,setChangeStatus] = useState(1);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    // Field variables
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [notificationToken, setNotificationToken] = useState('');
    const [status, setStatus] = useState('');
    const [userType, setUserType] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState('Select profile image');
    const [imageFile, setImageFile] = useState('');
    const [id,setId] = useState(0);
    // Field variables


    const handleOpen = (element) => {
        setOpen(true);
        setFullname(element.fullname);
        setEmail(element.email);
        setNotificationToken(element.notification_token);
        setStatus(element.status);
        setUserType(element.user_type_id);
        setPhoneNumber(element.phone_number);
        setGender(element.gender);
        setDistrict(element.region_id);
        setAddress(element.address);
        setImage(element.profile_image);
        setImageFile('');
        setId(element.id);
    }


    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateUser();
    }

    const handleChange = (event, value) => {
        setPage(value);
        getUsers(value);
    };

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this user?")) {
            deleteUser(element);
        }
    };

    const statusDialog = async (id) => {
        if (window.confirm("Do you want change status of this user all product?")) {
            changeStatusFun(id);
        }
    };

    const changeStatusFun =(id)=>{
        const body = {
            id:id,
            status:changeStatus
        }
        AxiosInstance.post('/user/change-product-status',body)
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully updated!");
            } else {
                showError("Something went wrong!");
            }
        })
        .catch(err => {
            showError(err + "");
        })
    }


    const deleteUser = (element) =>{
        AxiosInstance.delete('/user/delete-user/'+element.id)
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully deleted!");
                getUsers(page);
            } else {
                showError("Something went wrong!");
            }
        })
        .catch(err => {
            showError(err + "");
        })
    }

    const handleFile = (e) => {
        setImage(e.target.files[0].name);
        setImageFile(e.target.files[0]);
        compressImage(e.target.files);
    }

    const updateUser=()=>{
        setLoading(true);
        let formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('address', address);
        formData.append('phone_number', phoneNumber);
        formData.append('user_type_id', userType);
        formData.append('region_id', district);
        formData.append('status', status);
        formData.append('email', email);
        formData.append('notification_token', notificationToken);
        formData.append('gender', gender);
        formData.append('id', id);
        if(imageFile!='') {
            formData.append('image',imageFile);
        }
        AxiosInstance.put('/user/update-user',formData)
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully updated!");
                setLoading(false);
                clearInput();
                handleClose();
                getUsers(1);
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

    const clearInput=()=>{
        setFullname('');
        setEmail('');
        setNotificationToken('');
        setStatus('');
        setUserType('');
        setPhoneNumber('');
        setGender('');
        setDistrict('');
        setAddress('');
        setImage('Select profile image');
        setImageFile('');
        setId(0);
    }

    const compress = new Compress();
    function compressImage(fls) {
        const files = [...fls]
        compress.compress(files, {
            size: 1, // the max size in MB, defaults to 2MB
            quality: .20, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
            rotate: false, // See the rotation section below
        }).then((results) => {
            const img1 = results[0]
            const base64str = img1.data
            const imgExt = img1.ext
            const file = Compress.convertBase64ToFile(base64str, imgExt);
            setImageFile(file);
        })
    }

    return (
        <div>
            {((typeof users === 'undefined' || users.length <= 0) && !isEmptyPage) ? <Loading /> : ((typeof users === 'undefined' || users.length <= 0) && isEmptyPage) ? <Empty /> :
                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell align="left">Image</TableCell>
                                    <TableCell align="left">Full name</TableCell>
                                    <TableCell align="left">User type</TableCell>
                                    <TableCell align="left">Gender</TableCell>
                                    <TableCell align="left">Phone number</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="left">DELETE</TableCell>
                                    <TableCell align="left">EDIT</TableCell>
                                    <TableCell align="left">CHANGE PRODUCT STATUS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users.map((element, i) => {
                                        return (
                                            <TableRow
                                                key="key"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{element.id}</TableCell>
                                                <TableCell align="left">
                                                {element.profile_image != null ? <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="imgUser" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + element.profile_image} className="imgUser" />
                                                    : <img src={data.user.placeholder} className="imgUser" />
                                                }</TableCell>
                                                
                                                <TableCell align="left">{element.fullname}</TableCell>
                                                <TableCell align="left">{element.user_type}</TableCell>
                                                <TableCell align="left">{checkGender(element.gender).label}</TableCell>
                                                <TableCell align="left">{element.phone_number}</TableCell>
                                                <TableCell align="left">{checkStatus(element.status).label}</TableCell>
                                                <TableCell align="left"> <IconButton aria-label="delete" color="secondary" onClick={()=>confirmDialog(element)}><DeleteIcon /></IconButton></TableCell>
                                                <TableCell align="left"> <IconButton aria-label="edit" color="success" onClick={()=>handleOpen(element)}><EditIcon /></IconButton></TableCell>
                                                <TableCell align="left">
                                                <Stack direction={'row'} spacing={2}>
                                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={changeStatus}
                                        onChange={e => setChangeStatus(e.target.value)}
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
                                <Button aria-label="edit" variant="contained" color="primary" onClick={()=>statusDialog(element.id)}>OK</Button>

                                                </Stack> 
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }



                            </TableBody>
                        </Table>
                    </TableContainer>

                    <br />
                    <Stack direction={"row"} justifyContent={"center"}>
                        <Pagination count={page_count} 
                        page={page}
                        onChange={handleChange}
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
                                    label="Full name"
                                    defaultValue=""
                                    value={fullname}
                                    onChange={e => setFullname(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Email"
                                    defaultValue=""
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Notification token"
                                    defaultValue=""
                                    value={notificationToken}
                                    onChange={e => setNotificationToken(e.target.value)}
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
                                            userStatuses.map((status) => {
                                                return (
                                                    <MenuItem
                                                        key={status.value}
                                                        value={status.value}
                                                    >
                                                        {status.label}
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
                                    <InputLabel id="demo-multiple-name-label">User type</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={userType}
                                        onChange={e => setUserType(e.target.value)}
                                        input={<OutlinedInput label="User type" />}
                                    >
                                        {
                                            userTypes.map((type, i) => {
                                                return (
                                                    <MenuItem
                                                        key={type.id}
                                                        value={type.id}
                                                    >
                                                        {type.user_type}
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
                                    required
                                    id="outlined-required"
                                    label="Phone number"
                                    defaultValue=""
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">Gender</InputLabel>
                                    <Select
                                        value={gender}
                                        onChange={e => setGender(e.target.value)}
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        input={<OutlinedInput label="Gender" />}
                                    >
                                        {
                                            genders.map((gender, i) => {
                                                return (
                                                    <MenuItem key={gender.value} value={gender.value}>{gender.label}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">District</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={district}
                                        onChange={e => setDistrict(e.target.value)}
                                        input={<OutlinedInput label="District" />}
                                    >
                                        {
                                            districts.map((type, i) => {
                                                return (
                                                    <MenuItem
                                                        key={type.id}
                                                        value={type.id}
                                                    >
                                                        {type.district_name_tm}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={12}>
                                <TextField
                                    fullWidth
                                    id="filled-textarea"
                                    label="Adress"
                                    placeholder="Address..."
                                    multiline
                                    rows={4}
                                    variant="filled"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={12}>
                                <label htmlFor="contained-button-file2">
                                    <Input accept="image/*" id="contained-button-file2" type="file" multiple onChange={handleFile} />
                                    <FileBrowse component="span" image={image}>
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

                    </Stack>
                </Box>
            </Modal>
            {/* End of modal edit */}
        </div>
    )
}

export default UsersTable
