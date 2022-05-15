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
import UsersTable from './UsersTable';
import { styled } from '@mui/material/styles';
import FileBrowse from '../FileBrowse/FileBrowse';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { useEffect } from 'react';
import { genders, ProductLimit, userStatuses } from '../Constants/Constant.mjs';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import Compress from 'compress.js';
import {useTranslation} from '../../components/sidebar/Sidebar'

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
    display: 'block',
    overflowX: 'hidden'
};

const Input = styled('input')({
    display: 'none',
});

function Users() {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isLoading, setLoading] = useState(false);
    const [userTypes, setTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isEmptyPage, setEmptyPage] = useState(false);
    const [page_count, setPageCount] = useState(0);
    const [query, setQuery] = useState('');


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
    // Field variables

    const handleClick = () => {
        addUser();
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
    }

    const handleFile = (e) => {
        setImage(e.target.files[0].name);
        setImageFile(e.target.files[0]);
        compressImage(e.target.files);
    }

    const [selectType, setSelectedType] = useState('');

    useEffect(() => {
        getUserTypes();
        getDistrict();
    }, []);

    const getDistrict = () => {
        AxiosInstance.get('/district/get-district')
            .then(response => {
                if (!response.data.error) {
                    setDistricts(response.data.body);
                } else {
                    showError(t("Something went wrong!"));

                }
            })
            .catch(error => {
                showError(error + "");
            })
    }

    const getUserTypes = () => {
        AxiosInstance.get('/user-type/get-user-type')
            .then(response => {
                if (!response.data.error) {
                    setTypes(response.data.body);
                } else {
                    showError(t("Something went wrong!"));

                }
            })
            .catch(error => {
                showError(error + "");
            })
    }

    const getUsers = (page) => {
        let url = '/user/get-user?page=' + page + '&limit=' + ProductLimit + '&query=' + query;
        AxiosInstance.get(url)
            .then(response => {
                if (!response.data.error) {
                    setUsers(response.data.body.users);
                    if (page == 1)
                        setPageCount(response.data.body.page_count)
                    if (typeof response.data.body.users === 'undefined' || response.data.body.users.length == 0) {
                        setEmptyPage(true);
                    } else {
                        setEmptyPage(false);
                    }
                } else {
                    showError(t("Something went wrong!"));
                    if (users.length == 0) {
                        setEmptyPage(true);
                    }

                }
            })
            .catch(error => {
                showError(error + "");
                if (users.length == 0) {
                    setEmptyPage(true);
                }
            })
    }




    function handleEnter(event) {
        if (event.key === 'Enter') {
            getUsers(1);
        }
    }

    useEffect(() => {
        if (query.length == 0) {
            getUsers(1);
        }
    }, [query]);

    const addUser=()=>{
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
        if(imageFile!='') {
            formData.append('image',imageFile);
        }
        AxiosInstance.post('/user/add-user',formData)
        .then(response => {
            if (!response.data.error) {
                showSuccess(t("Successfully added!"));
                setLoading(false);
                clearInput();
                handleClose();
                getUsers(1)
            } else {
                showError(t("Something went wrong!"));
                setLoading(false);
            }
        })
        .catch(error => {
            showError(error + "");
            setLoading(false);
        })
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
            <ToastContainer />
            <Stack
                direction={'column'}
                spacing={4}
            >

                <Grid container spacing={0}>
                    <Grid item lg={5} xs={8}>
                        <Paper
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                        >
                            <InputBase
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={e => handleEnter(e)}
                                sx={{ ml: 1, flex: 1 }}
                                placeholder={t('search placeholder')}
                                inputProps={{ 'aria-label': 'search google maps' }}
                            />
                            <IconButton sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                    <Grid item lg={7} xs={12}>
                        <Stack
                            direction={'row'}
                            spacing={4}
                            justifyContent={'flex-end'}
                        >
                            <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>{t('Add User')}</Button>
                        </Stack>
                    </Grid>
                </Grid>




                <UsersTable page_count={page_count} getUsers={getUsers} userTypes={userTypes} isEmptyPage={isEmptyPage} districts={districts} users={users} />
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
                                    label={t('Full name')}
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
                                    label={t('Email')}
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
                                    label={t('Notification token')}
                                    defaultValue=""
                                    value={notificationToken}
                                    onChange={e => setNotificationToken(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">{t('Status')}</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        input={<OutlinedInput label={t('Status')} />}
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
                                    <InputLabel id="demo-multiple-name-label">{t('User type')}</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={userType}
                                        onChange={e => setUserType(e.target.value)}
                                        input={<OutlinedInput label={t("User type")} />}
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
                                    label={t('Phone number')}
                                    defaultValue=""
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">{t('Gender')}</InputLabel>
                                    <Select
                                        value={gender}
                                        onChange={e => setGender(e.target.value)}
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        input={<OutlinedInput label={t("Gender")} />}
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
                                    <InputLabel id="demo-multiple-name-label">{t('District')}</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={district}
                                        onChange={e => setDistrict(e.target.value)}
                                        input={<OutlinedInput label={t("District")} />}
                                    >
                                        {
                                            districts.map((type, i) => {
                                                return (
                                                    <MenuItem
                                                        key={type.id}
                                                        value={type.id}
                                                    >
                                                        {type.district_name_ru}
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
                                    label={t('Address')}
                                    placeholder={t('Address')+"..."}
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
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        color="primary"
                                        fullWidth={true}
                                        onClick={handleClick}
                                    >
                                        {isLoading ? <Typography variant="action">{t('Please wait...')}</Typography> : <Typography variant="action">{t('Add')}</Typography>}
                                    </LoadingButton>

                                }

                            </Grid>
                        </Grid>

                    </Stack>
                </Box>
            </Modal>
            {/* End of modal add */}

        </div>
    )
}

export default Users

