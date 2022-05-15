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
import { Modal, Stack, Typography } from '@mui/material';
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
import { showWarning, showError, showSuccess } from '../Alert/Alert.mjs'
import FileBrowse from '../FileBrowse/FileBrowse';
import { styled } from '@mui/material/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { server_ip } from '../Axios/AxiosInstance';
import { data } from '../../constants';
import { useTranslation } from '../../components/sidebar/Sidebar';

const Input = styled('input')({
    display: 'none',
});

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
};

const CategoryTable = ({ list, getData, isEmpty }) => {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const [name_tm, setNameTm] = useState('');
    const [name_ru, setNameRu] = useState('');
    const [name_en, setNameEn] = useState('');
    const [status, setStatus] = useState(1);
    const [isMain, setMain] = useState(false);
    const [id, setId] = useState(0);
    const [image, setImage] = useState('Select image');
    const [selectedFile, setFile] = useState('');

    const handleFileInput = (e) => {
        setImage(e.target.files[0].name);
        setFile(e.target.files[0]);
    }

    const handleOpen = (element) => {
        setOpen(true);
        setNameTm(element.category_name_tm);
        setNameRu(element.category_name_ru);
        setNameEn(element.category_name_en);
        setStatus(element.status);
        setMain(element.is_main);
        setId(element.id);
        setImage(element.image);
        setFile('');
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
        setImage('Select image');
        setFile('');
        setMain(false);
        setImage('Select image');
        setFile('');
    }

    const updateCategory = () => {
        if (name_tm == '' || name_ru == '' || name_en == '' || id == 0) {
            showWarning("Enter all required information");
            return;
        }
        setLoading(!isLoading);
        let category = new FormData();
        category.append('nameTM', name_tm);
        category.append('nameRU', name_ru);
        category.append('nameEN', name_en);
        category.append('status', status);
        category.append('isMain', isMain);
        category.append('id', id);
        if (selectedFile != '') {
            category.append('file', selectedFile);
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
        AxiosInstance.delete('/category/delete-category/' + element.id + '?filename=' + element.image)
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
                                <TableCell align="left">{t('Image')}</TableCell>
                                <TableCell align="left">{t('Name TM')}</TableCell>
                                <TableCell align="left">{t('Name RU')}</TableCell>
                                <TableCell align="left">{t('Name EN')}</TableCell>
                                <TableCell align="left">{t('Status')}</TableCell>
                                <TableCell align="left">{t('is Main')}</TableCell>
                                <TableCell align="left">{t('DELETE')}</TableCell>
                                <TableCell align="left">{t('EDIT')}</TableCell>
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
                                            <TableCell align="left">
                                                <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + element.image} className="img" /></TableCell>
                                            <TableCell align="left">{element.category_name_tm}</TableCell>
                                            <TableCell align="left">{element.category_name_ru}</TableCell>
                                            <TableCell align="left">{element.category_name_en}</TableCell>
                                            <TableCell align="left">{(element.status == '0' || element.status === '') ? <label>Passive</label> : <label>Active</label>}</TableCell>
                                            <TableCell align="left">{element.is_main ? <label>Yes</label> : <label>No</label>}</TableCell>
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
                                    label={t('Category name turkmen')}
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
                                    label={t('Category name russian')}
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
                                    label={t('Category name english')}
                                    defaultValue=""
                                    onChange={e => setNameEn(e.target.value)}
                                    value={name_en}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">{t('Status')}</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        onChange={e => setStatus(e.target.value)}
                                        value={status}
                                        input={<OutlinedInput label={t('Status')} />}
                                    >
                                        <MenuItem
                                            key="Active"
                                            value="1"
                                        >
                                            {t('Active')}
                                        </MenuItem>

                                        <MenuItem
                                            key="Passive"
                                            value="0"
                                        >
                                            {t('Passive')}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} lg={12}>
                                <label htmlFor="contained-button-file3">
                                    <Input accept="image/*" id="contained-button-file3" type="file" onChange={handleFileInput} />
                                    <FileBrowse component="span" image={image}>
                                    </FileBrowse>
                                </label>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={12}>
                                <FormControlLabel style={{ marginLeft: '5px' }} control={<Checkbox defaultChecked onChange={e => setMain(!isMain)}
                                    value={isMain} checked={isMain} />} label={t('is Main')} />
                            </Grid>

                            <Grid item md={12} lg={12}>
                                {
                                    <LoadingButton
                                        loading={isLoading}
                                        loadingPosition="start"
                                        startIcon={<EditIcon />}
                                        variant="contained"
                                        color="primary"
                                        fullWidth={true}
                                        onClick={handleClick}
                                    >
                                        {isLoading ? <Typography variant="action">{t('Please wait...')}</Typography> : <Typography variant="action">{t('EDIT')}</Typography>}
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
