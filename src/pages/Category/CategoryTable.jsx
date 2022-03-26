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
import './categoryTable.css';
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
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import Checkbox from '@mui/material/Checkbox';
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';
import { AxiosInstance } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {showWarning,showError,showSuccess} from '../Alert/Alert.mjs'

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
};

const CategoryTable = ({ list, getData, isEmpty }) => {
    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => setOpen(false);
    const [name_tm, setNameTm] = useState('');
    const [name_ru, setNameRu] = useState('');
    const [name_en, setNameEn] = useState('');
    const [status, setStatus] = useState(1);
    const [isMain, setMain] = useState(false);
    const [id, setId] = useState(0);
    const handleOpen = (element) => {
        setOpen(true);
        setNameTm(element.category_name_tm);
        setNameRu(element.category_name_ru);
        setNameEn(element.category_name_en);
        setStatus(element.status);
        setMain(element.is_main);
        setId(element.id);
    };
    const [isLoading, setLoading] = useState(false);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateCategory();
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this category?")) {
            deleteCategory(element);
        }
    };

    const clearInput = () => {
        setNameTm('');
        setNameRu('');
        setNameEn('');
        setStatus(1);
        setMain(false);
    }

    const updateCategory = () => {
        if (name_tm == '' || name_ru == '' || name_en == '' || id==0) {
            showWarning("Enter all required information");
            return;
        }
        setLoading(!isLoading);
        const category = {
            id:id,
            nameTM: name_tm,
            nameRU: name_ru,
            nameEN: name_en,
            status: status,
            isMain: isMain
        }

        AxiosInstance.put('/category/update-category', category)
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


    const deleteCategory = async (element) => {
        AxiosInstance.delete('/category/delete-category/' + element.id)
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
                                <TableCell align="left">Name TM</TableCell>
                                <TableCell align="left">Name RU</TableCell>
                                <TableCell align="left">Name EN</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">Is Main</TableCell>
                                <TableCell align="left">DELETE</TableCell>
                                <TableCell align="left">EDIT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {

                                list.map((element, i) => {
                                    return (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{element.id}</TableCell>
                                            <TableCell align="left">{element.category_name_tm}</TableCell>
                                            <TableCell align="left">{element.category_name_ru}</TableCell>
                                            <TableCell align="left">{element.category_name_en}</TableCell>
                                            <TableCell align="left">{(element.status == '0' || element.status === '') ? <label>Passive</label> : <label>Active</label>}</TableCell>
                                            <TableCell align="left">{element.is_main?<label>Yes</label>:<label>No</label>}</TableCell>
                                            <TableCell align="left"> <IconButton aria-label="delete" color="secondary" onClick={() => confirmDialog(element)}><DeleteIcon /></IconButton></TableCell>
                                            <TableCell align="left"> <IconButton aria-label="delete" color="success" onClick={()=>handleOpen(element)}><EditIcon /></IconButton></TableCell>
                                        </TableRow>
                                    )
                                })
                            }



                        </TableBody>
                    </Table>
                </TableContainer>
            }

            <br />



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
                                    label="Category name turkmen"
                                    defaultValue=""
                                    onChange={e => setNameTm(e.target.value)}
                                    value={name_tm}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Category name russian"
                                    defaultValue=""
                                    onChange={e => setNameRu(e.target.value)}
                                    value={name_ru}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Category name english"
                                    defaultValue=""
                                    onChange={e => setNameEn(e.target.value)}
                                    value={name_en}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        onChange={e => setStatus(e.target.value)}
                                        value={status}
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
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={4} lg={4}>
                                <FormControlLabel style={{ marginLeft: '5px' }} control={<Checkbox defaultChecked onChange={e => setMain(!isMain)}
                                    value={isMain} checked={isMain} />} label="is Main" />
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
        </div>
    )
}

export default CategoryTable
