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
import './holiday.css';
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
import { data } from '../../constants';
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { AxiosInstance, server_ip, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';

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

function HolidayTable({ holidays, getHoliday, isEmptyPage }) {
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => setOpen(false);
    const [nameTM, setNameTM] = useState('');
    const [nameRU, setNameRU] = useState('');
    const [nameEN, setNameEN] = useState('');
    const [id, setId] = useState('');
    const [isLoading, setLoading] = useState(false);
    const handleLoading = () => {
        setLoading(!isLoading);
    }
    const handleOpen = (element) => {
        setOpen(true);
        setNameTM(element.holiday_name_tm);
        setNameRU(element.holiday_name_ru);
        setNameEN(element.holiday_name_en);
        setId(element.id);
    }
    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateHoliday();
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this holiday?")) {
            deleteHoliday(element.id);
        }
    };

    const clearInput = () => {
        setNameTM('');
        setNameRU('');
        setNameEN('');
        setId('');
    }

    const deleteHoliday = (id) => {
        AxiosInstance.delete('/holiday/delete-holiday/' + id)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully deleted!");
                    getHoliday();
                } else {
                    showError("Something went wrong!");
                }
            })
            .catch(err => {
                showError(err + "");
            })
    }

    const updateHoliday = () => {
        if (nameTM == "" || nameRU == "" || nameEN == "") {
          showWarning("Please enter all required fields!");
          return;
        }
        const body = {
          nameTM: nameTM,
          nameRU: nameRU,
          nameEN: nameEN,
          id:id
        };
        setLoading(true);
        AxiosInstance.put("/holiday/update-holiday", body)
          .then(response => {
            if (!response.data.error) {
              showSuccess("Successfully updated!");
              setLoading(false);
              clearInput();
              handleClose();
              getHoliday();
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
            {((typeof holidays === 'undefined' || holidays.length <= 0) && !isEmptyPage) ? <Loading /> : ((typeof holidays === 'undefined' || holidays.length <= 0) && isEmptyPage) ? <Empty /> :


                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="left">Name TM</TableCell>
                                <TableCell align="left">Name RU</TableCell>
                                <TableCell align="left">Name EN</TableCell>
                                <TableCell align="left">DELETE</TableCell>
                                <TableCell align="left">EDIT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                holidays.map((element, i) => {
                                    return (
                                        <TableRow
                                            key={`key${element.id}`}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{element.id}</TableCell>
                                            <TableCell align="left">{element.holiday_name_tm}</TableCell>
                                            <TableCell align="left">{element.holiday_name_ru}</TableCell>
                                            <TableCell align="left">{element.holiday_name_en}</TableCell>
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
                                    label="Holiday name turkmen"
                                    defaultValue=""
                                    value={nameTM}
                                    onChange={e => setNameTM(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Holiday name russian"
                                    defaultValue=""
                                    value={nameRU}
                                    onChange={e => setNameRU(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label="Holiday name english"
                                    defaultValue=""
                                    value={nameEN}
                                    onChange={e => setNameEN(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
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
        </div>
    )
}

export default HolidayTable
