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
import './ads.css';
import { Modal, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { OutlinedInput, TextField } from '@mui/material'
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { data } from '../../constants'
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
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import { ads_status } from '../Constants/Constant.mjs';

const Input = styled('input')({
    display: 'none',
});

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

const AdsTable = ({ list, isEmpty, constants, getData }) => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [isLoading, setLoading] = useState(false);
    const [image, setImage] = useState('Select image');
    const [constant_id, setConstantId] = useState('');
    const [site_url, setUrl] = useState('');
    const [status, setStatus] = useState(1);
    const [selectedFile, setFile] = useState('');
    const [id, setId] = useState(0);
    const handleOpen = (element) => {
        setOpen(true);  
        setUrl(element.site_url);
        setConstantId(element.constant_id);
        setStatus(element.status);
        setImage(element.ads_image);
        setId(element.id);
    }

    const handleFileInput = (e) => {
        setImage(e.target.files[0].name);
        setFile(e.target.files[0]);
    }


    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateCategory();
    }

    const clearInput = () => {
        setConstantId('');
        setUrl('');
        setStatus(1);
        setFile('');
        setImage('Select image');
        setId(0);
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this ads?")) {
            deleteSubCategory(element);
        }
    };

    const updateCategory = () => {
        if ( id == 0) {
            showWarning("Enter all required information");
            return;
        }
        setLoading(true);
        let formData = new FormData();
        if (selectedFile != '') {
            formData.append('file',selectedFile);
        }
        formData.append('constant_id', constant_id);
        formData.append('site_url', site_url);
        formData.append('status', status);
        formData.append('id', id);
        AxiosInstanceFormData.put('/ads/update-ads', formData)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully updated!");
                    setLoading(false);
                    clearInput();
                    handleClose();
                    getData();
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

    const deleteSubCategory = async (element) => {
        AxiosInstance.delete('/ads/delete-ads/' + element.id+"?image="+element.ads_image)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully deleted!");
                    getData();
                } else {
                    showError("Something went wrong!");
                }
            })
            .catch(err => {
                showError(err + "");
            })
    }
    return (
        <div>
            {((typeof list === 'undefined' || list.length <= 0) && !isEmpty) ? <Loading /> : ((typeof list === 'undefined' || list.length <= 0) && isEmpty) ? <Empty /> :
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="left">Site URL</TableCell>
                                <TableCell align="left">Image</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">DELETE</TableCell>
                                <TableCell align="left">EDIT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                list.map((element, i) => {
                                    return (
                                        <TableRow
                                            key={element.id + "key" + element.site_url}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell key={element.id + "key" + element.site_url + data.user.placeholder} component="th" scope="row">{element.id}</TableCell>
                                            <TableCell align="left">{element.site_url}</TableCell>
                                            <TableCell align="left">
                                                <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + element.ads_image} className="img" /></TableCell>
                                            <TableCell align="left">{element.status}</TableCell>
                                            <TableCell align="left"> <IconButton aria-label="delete" color="secondary" onClick={() => confirmDialog(element)}><DeleteIcon /></IconButton></TableCell>
                                            <TableCell align="left"> <IconButton aria-label="delete" color="success" onClick={() => handleOpen(element)}><EditIcon /></IconButton></TableCell>
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


                        <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Site url"
                  defaultValue=""
                  value={site_url}
                  onChange={e => setUrl(e.target.value)}
                />
              </Grid>

              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                  <Select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    input={<OutlinedInput label="Status" />}
                  >
                  

                    {
                      ads_status.map((st,i)=>{
                        return(
                          <MenuItem
                            key={`keeyy${i}`}
                            value={st.label}
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
                  <InputLabel id="demo-multiple-name-label">Constant id</InputLabel>
                  <Select
                    value={constant_id}
                    onChange={e => setConstantId(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    input={<OutlinedInput label="Constant" />}
                  >
                    {
                      constants?.map((element, i) => {
                        return (
                          <MenuItem key={i} value={element.id}>
                            {element.titleTM}
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={12} lg={6}>
              </Grid>
              <Grid item md={12} lg={12}>
                <label htmlFor="contained-button-file3">
                  <Input accept="image/*" id="contained-button-file3" type="file" onChange={handleFileInput} />
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

export default AdsTable
