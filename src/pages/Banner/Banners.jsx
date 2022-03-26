import { Button, FormControlLabel, FormHelperText, IconButton, OutlinedInput, TextField } from '@mui/material'
import React, { useState,useEffect } from 'react'
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
import BannersTable from './BannersTable';
import { styled } from '@mui/material/styles';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import FileBrowse from '../FileBrowse/FileBrowse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const Input = styled('input')({
    display: 'none',
});

function Banners() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isLoading, setLoading] = useState(false);
    const [isEmptyPage, setEmptyPage] = useState(false);
    const [banners,setBanners]= useState([]);


    // Field variables
    const [imageTM, setImageTM] = useState('Banner image turkmen');
    const [imageRU, setImageRU] = useState('Banner image russian');
    const [imageEN, setImageEN] = useState('Banner image english');
    const [imageTMFile, setImageTMFile] = useState('');
    const [imageRUFile, setImageRUFile] = useState('');
    const [imageENFile, setImageENFile] = useState('');
    const [order,setOrder] = useState(0);
    const [siteUrl, setSiteUrl] = useState('');
    const [status, setStatus] = useState('');
    // Field variables

    const clearInput=()=>{
        setImageTM('Banner image turkmen');
        setImageRU('Banner image russian');
        setImageEN('Banner image english');
        setImageTMFile('');
        setImageRUFile('');
        setImageENFile('');
        setOrder('');
        setSiteUrl('');
        setStatus('');
    }
    const handleFileInputTM = (e) => {
        setImageTM(e.target.files[0].name);
        setImageTMFile(e.target.files[0]);
    }

    const handleFileInputRU = (e) => {
        setImageRU(e.target.files[0].name);
        setImageRUFile(e.target.files[0]);
    }

    const handleFileInputEN = (e) => {
        setImageEN(e.target.files[0].name);
        setImageENFile(e.target.files[0]);
    }

    const handleClick = () => {
        addBanner();
    }

    const addBanner = () => {
        if(imageENFile=='' || imageTMFile=='' || imageRUFile==''){
            showWarning("Enter all required fields");
            return;
        }
        setLoading(true);
        let formdata=new FormData();
        formdata.append('file_tm',imageTMFile);
        formdata.append('file_en',imageENFile);
        formdata.append('file_ru',imageRUFile);
        formdata.append('order',order);
        formdata.append('status',status);
        formdata.append('siteURL',siteUrl);

        AxiosInstanceFormData.post('/banner/add-banner',formdata)
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully added!");
                setLoading(false);
                clearInput();
                handleClose();
                getBanners()
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

    useEffect(()=>{
        getBanners();
    },[]);

    const getBanners=()=>{
        AxiosInstance.get('/banner/getBanner')
        .then(response => {
            if (!response.data.error) {
                setBanners(response.data.body);
                if (typeof response.data.body === 'undefined' || response.data.body == 0) {
                    setEmptyPage(true);
                } else {
                    setEmptyPage(false);
                }
            } else {
                showError("Something went wrong!");
                if (banners.length == 0) {
                    setEmptyPage(true);
                }

            }
        })
        .catch(error => {
            showError(error + "");
            if (banners.length == 0) {
                setEmptyPage(true);
            }
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
                    <Grid item lg={6}>
                        <h2>Banners</h2>
                    </Grid>
                    <Grid item lg={6}>
                        <Stack
                            direction={'row'}
                            spacing={4}
                            justifyContent={'flex-end'}
                        >
                            <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add Banner</Button>
                        </Stack>
                    </Grid>
                </Grid>





                <BannersTable banners={banners} getBanners={getBanners} isEmptyPage={isEmptyPage}/>
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
                        <Grid container spacing={1}>
                        <Grid item md={12} lg={12}>
                                <label htmlFor="contained-button-file1">
                                    <Input accept="image/*" id="contained-button-file1" type="file" multiple onChange={handleFileInputTM} />
                                    <FileBrowse component="span" image={imageTM}>
                                    </FileBrowse>
                                </label>
                            </Grid>
                            <Grid item md={12} lg={12}>
                                <label htmlFor="contained-button-file2">
                                    <Input accept="image/*" id="contained-button-file2" type="file" multiple onChange={handleFileInputRU} />
                                    <FileBrowse component="span" image={imageRU}>
                                    </FileBrowse>
                                </label>
                            </Grid>
                            <Grid item md={12} lg={12}>
                                <label htmlFor="contained-button-file3">
                                    <Input accept="image/*" id="contained-button-file3" type="file" multiple onChange={handleFileInputEN} />
                                    <FileBrowse component="span" image={imageEN}>
                                    </FileBrowse>
                                </label>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={status}
                                        onChange={e=>setStatus(e.target.value)}
                                        input={<OutlinedInput label="Status" />}
                                    >
                                        <MenuItem
                                            key="Active"
                                            value="1"
                                        >
                                            Active
                                        </MenuItem>

                                        <MenuItem
                                            key="Passive"
                                            value="0"
                                        >
                                            Passive
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Order"
                                    type="number"
                                    value={order}
                                    onChange={e=>setOrder(e.target.value)}
                                    defaultValue="0"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                            <Grid item md={12} lg={12}>
                                <TextField
                                    fullWidth
                                    id="filled-textarea"
                                    label="URL"
                                    placeholder="Enter URL..."
                                    multiline
                                    rows={4}
                                    value={siteUrl}
                                    onChange={e=>setSiteUrl(e.target.value)}
                                    variant="filled"
                                />
                            </Grid>
                            <br/>
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

        </div>
    )
}

export default Banners

