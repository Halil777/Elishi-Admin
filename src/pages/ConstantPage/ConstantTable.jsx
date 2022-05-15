import React, { useState,useRef } from 'react'
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
import './constant.css';
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
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';
import { AxiosInstance } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import Typography from '@mui/material/Typography';
import JoditEditor from "jodit-react";
import './constant.css';
import {useTranslation} from '../../components/sidebar/Sidebar';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
    height: '100%',
    display: 'block',
    overflowX: 'hidden'
};

const ConstantTable = ({ constants, getConstants, isEmptyPage }) => {
    const {t} = useTranslation();
    const editor = useRef(null)

    const config = {
        readonly: false,
        placeholder: 'Start typings...',
        height: 400
    };

    const darkConfig = {
        readonly: false,
        placeholder: 'Start typings...',
        height: 400,
        theme: 'dark'
    };
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);

    const [isLoading, setLoading] = useState(false);
    const handleLoading = () => {
        updateConstant();
    }

    // Field variables
    const [titleTM, setTitleTM] = useState('');
    const [titleRU, setTitleRU] = useState('');
    const [titleEN, setTitleEN] = useState('');
    const [contentLightTM, setContentLightTM] = useState('');
    const [contentLightRU, setContentLightRU] = useState('');
    const [contentLightEN, setContentLightEN] = useState('');
    const [contentDarkTM, setContentDarkTM] = useState('');
    const [contentDarkRU, setContentDarkRU] = useState('');
    const [contentDarkEN, setContentDarkEN] = useState('');
    const [type, setType] = useState('');
    const [id, setId] = useState('');
    // Field variables

    const handleOpen = (element) => {
        setOpen(true);
        setTitleTM(element.titleTM);
        setTitleRU(element.titleRU);
        setTitleEN(element.titleEN);
        setContentLightTM(element.content_light_tm);
        setContentLightRU(element.content_light_ru);
        setContentLightEN(element.content_light_en);
        setContentDarkTM(element.content_dark_tm);
        setContentDarkRU(element.content_dark_ru);
        setContentDarkEN(element.content_dark_en);
        setType(element.page_type);
        setId(element.id);
    }
    const clearInput = () => {
        setTitleTM('');
        setTitleRU('');
        setTitleEN('');
        setContentLightTM('');
        setContentLightRU('');
        setContentLightEN('');
        setContentDarkTM('');
        setContentDarkRU('');
        setContentDarkEN('');
        setType('');
        setId('');
    }

    const updateConstant = () => {
        if (titleTM == '' || titleRU == '' || titleEN == '' || type == '' || contentLightTM == '' || contentLightRU == '' || contentLightEN == '' || contentDarkTM == '' || contentDarkRU == '' || contentDarkEN == '') {
            showWarning("Please enter required informations");
            return;
        }
        setLoading(true);
        const body = {
            titleTM: titleTM,
            titleRU: titleRU,
            titleEN: titleEN,
            lightTM: contentLightTM,
            lightRU: contentLightRU,
            lightEN: contentLightEN,
            darkTM: contentDarkTM,
            darkRU: contentDarkRU,
            darkEN: contentDarkEN,
            type: type,
            id: id
        }
        AxiosInstance.put('/constant-page/update-constant', body)
            .then(response => {
                if (!response.data.error) {
                    showSuccess(t("Successfully updated!"));
                    setLoading(false);
                    clearInput();
                    handleClose();
                    getConstants()
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


    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateConstant();
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this constant?")) {
            deleteConstant(element.id);
        }
    };

    const deleteConstant = (id) => {
        AxiosInstance.delete('/constant-page/delete-constant/' + id)
            .then(response => {
                if (!response.data.error) {
                    showSuccess(t("Successfully deleted!"));
                    getConstants();
                } else {
                    showError(t("Something went wrong!"));
                }
            })
            .catch(err => {
                showError(err + "");
            })
    }
    return (
        <div>
            {((typeof constants === 'undefined' || constants.length <= 0 || constants === null) && !isEmptyPage) ? <Loading /> : ((typeof constants === 'undefined' || constants.length <= 0 || constants === null) && isEmptyPage) ? <Empty /> :

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="left">{t('Title turkmen')}</TableCell>
                                <TableCell align="left">{t('Title russian')}</TableCell>
                                <TableCell align="left">{t('Title english')}</TableCell>
                                <TableCell align="left">{t('Type')}</TableCell>
                                <TableCell align="left">{t('DELETE')}</TableCell>
                                <TableCell align="left">{t('EDIT')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                constants.map((element, i) => {
                                    return (
                                        <TableRow
                                            key={`keeey${i}`}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{element.id}</TableCell>
                                            <TableCell align="left">{element.titleTM}</TableCell>
                                            <TableCell align="left">{element.titleRU}</TableCell>
                                            <TableCell align="left">{element.titleEN}</TableCell>
                                            <TableCell align="left">{element.page_type}</TableCell>
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
                                    label={t("Title turkmen")}
                                    defaultValue=""
                                    value={titleTM}
                                    onChange={e => setTitleTM(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label={t("Title russian")}
                                    defaultValue=""
                                    value={titleRU}
                                    onChange={e => setTitleRU(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label={t("Title english")}
                                    defaultValue=""
                                    value={titleEN}
                                    onChange={e => setTitleEN(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label={t("Type")}
                                    defaultValue=""
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <Typography variant="h6">{t('Content light turkmen')}</Typography>
                                <div className="light">
                                    <JoditEditor
                                        ref={editor}
                                        value={contentLightTM}
                                        config={config}
                                        className="light"
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={newContent => setContentLightTM(newContent)} // preferred to use only this option to update the content for performance reasons
                                        onChange={newContent => { }}
                                    />
                                </div>
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <Typography variant="h6">{t('Content light russion')}</Typography>
                                <div className="light">
                                    <JoditEditor
                                        ref={editor}
                                        value={contentLightRU}
                                        config={config}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={newContent => setContentLightRU(newContent)} // preferred to use only this option to update the content for performance reasons
                                        onChange={newContent => { }}
                                    />
                                </div>

                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <Typography variant="h6">{t('Content light english')}</Typography>
                                <div className="light">
                                    <JoditEditor
                                        ref={editor}
                                        value={contentLightEN}
                                        config={config}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={newContent => setContentLightEN(newContent)} // preferred to use only this option to update the content for performance reasons
                                        onChange={newContent => { }}
                                    />
                                </div>
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <Typography variant="h6">{t('Content dark turkmen')}</Typography>
                                <div className="dark">
                                    <JoditEditor
                                        ref={editor}
                                        value={contentDarkTM}
                                        config={darkConfig}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={newContent => setContentDarkTM(newContent)} // preferred to use only this option to update the content for performance reasons
                                        onChange={newContent => { }}
                                    />
                                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <Typography variant="h6">{t('Content dark russian')}</Typography>
                                <div className="dark">
                                    <JoditEditor
                                        ref={editor}
                                        value={contentDarkRU}
                                        config={darkConfig}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={newContent => setContentDarkRU(newContent)} // preferred to use only this option to update the content for performance reasons
                                        onChange={newContent => { }}
                                    />
                                </div>
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <Typography variant="h6">{t('Content dark english')}</Typography>
                                <div className="dark">
                                    <JoditEditor
                                        ref={editor}
                                        value={contentDarkEN}
                                        config={darkConfig}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={newContent => setContentDarkEN(newContent)} // preferred to use only this option to update the content for performance reasons
                                        onChange={newContent => { }}
                                    />
                                </div>
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
                                        {isLoading ? <Typography variant="action">{t('Please wait...')}</Typography> : <Typography variant="action">{t('Edit')}</Typography>}
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

export default ConstantTable
