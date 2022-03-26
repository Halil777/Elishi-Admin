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
import './banners.css';
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
import { AxiosInstance, server_ip,AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import FileBrowse from '../FileBrowse/FileBrowse';
import { checkStatus } from '../Constants/Constant.mjs';


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

function BannersTable({banners,isEmptyPage,getBanners}) {
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => setOpen(false);

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
     const [id, setId] = useState(0);
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
         setId(0);
     }

     const handleOpen = (element) => {
         setOpen(true);
         setImageTM(element.banner_image_tm);
         setImageRU(element.banner_image_ru);
         setImageEN(element.banner_image_en);
         setImageTMFile('');
         setImageRUFile('');
         setImageENFile('');
         setOrder(element.order);
         setSiteUrl(element.siteURL);
         setStatus(element.status);
         setId(element.id);
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

    const [isLoading, setLoading] = useState(false);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateBanner();
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this banner?")) {
            deleteBanner(element.id);
        }
    };

    const deleteBanner=(id)=>{
        AxiosInstance.delete('/banner/delete-banner/'+id)
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully deleted!");
                getBanners();
            } else {
                showError("Something went wrong!");
            }
        })
        .catch(err => {
            showError(err + "");
        })
    }

    const updateBanner = () => {
        setLoading(true);
        let formdata=new FormData();
        if(imageTMFile!='')
            formdata.append('file_tm',imageTMFile);
        if(imageENFile!='')
            formdata.append('file_en',imageENFile);
        if(imageRUFile!='')
            formdata.append('file_ru',imageRUFile);
        formdata.append('order',order);
        formdata.append('status',status);
        formdata.append('siteURL',siteUrl);
        formdata.append('id',id);

        AxiosInstanceFormData.put('/banner/update-banner',formdata)
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully updated!");
                setLoading(false);
                clearInput();
                handleClose();
                getBanners();
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
        {((typeof banners === 'undefined' || banners.length <= 0) && !isEmptyPage) ? <Loading /> : ((typeof banners === 'undefined' || banners.length <= 0) && isEmptyPage) ? <Empty /> :
              
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Image Turkmen</TableCell>
                            <TableCell align="left">Image Russian</TableCell>
                            <TableCell align="left">Image English</TableCell>
                            <TableCell align="left">Order</TableCell>
                            <TableCell align="left">Site URL</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">DELETE</TableCell>
                            <TableCell align="left">EDIT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            banners.map((element, i) => {
                                return (
                                    <TableRow
                                        key={`keeey${element.id}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{element.id}</TableCell>
                                        <TableCell align="left">
                                            {element.banner_image_tm != null ? <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + element.banner_image_tm} className="img" />
                                                    : <img src={data.user.placeholder} className="img" />
                                                }
                                        </TableCell>
                                        <TableCell align="left">
                                        {element.banner_image_ru != null ? <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + element.banner_image_ru} className="img" />
                                                    : <img src={data.user.placeholder} className="img" />
                                                }
                                        </TableCell>
                                        <TableCell align="left">
                                        {element.banner_image_en != null ? <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + element.banner_image_en} className="img" />
                                                    : <img src={data.user.placeholder} className="img" />
                                                }
                                        </TableCell>
                                        <TableCell align="left">{element.order}</TableCell>
                                        <TableCell align="left">{element.siteURL}</TableCell>
                                        <TableCell align="left">{checkStatus(element.status).label}</TableCell>
                                        <TableCell align="left"> <IconButton aria-label="delete" color="secondary" onClick={()=>confirmDialog(element)}><DeleteIcon /></IconButton></TableCell>
                                        <TableCell align="left"> <IconButton aria-label="delete" color="success" onClick={()=>handleOpen(element)}><EditIcon /></IconButton></TableCell>
                                    </TableRow>
                                )
                            })
                        }



                    </TableBody>
                </Table>
            </TableContainer>
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

export default BannersTable
