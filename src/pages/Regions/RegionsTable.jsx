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
import './regions.css';
import { Modal, Stack, Typography } from '@mui/material';
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
import { AxiosInstance } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';
import {useTranslation} from '../../components/sidebar/Sidebar';

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

const HolidayTable = ({ list, isEmpty, getRegion }) => {
    const {t} = useTranslation();
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => setOpen(false);

    // Field variables
    const [nameTM, setNameTM] = useState('');
    const [nameRU, setNameRU] = useState('');
    const [nameEN, setNameEN] = useState('');
    const [id, setId] = useState('');
    // Field variables
    const handleOpen = (element) => {
        setOpen(true);
        setNameTM(element.region_name_tm);
        setNameRU(element.region_name_ru);
        setNameEN(element.region_name_en);
        setId(element.id);
    }
    const [isLoading, setLoading] = useState(false);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        UpdateRegion();
    }

    const clearInput=() => {
        setNameTM("");
        setNameRU("");
        setNameEN("");
        setId("");
      }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this region?")) {
            deleteRegion(element.id)
        }
    };

    const deleteRegion=(id)=>{
        AxiosInstance.delete('/region/delete-region/'+id)
        .then(response => {
            if (!response.data.error) {
                showSuccess("Successfully deleted!");
                getRegion();
            } else {
                showError("Something went wrong!");
            }
        })
        .catch(err => {
            showError(err + "");
        })
    }

    const UpdateRegion=()=>{
        if(nameTM=='' || nameRU=='' || nameEN==''){
          showWarning("Please enter required information!");
          return;
        }
        setLoading(true);
        const body = {
          region_name_tm:nameTM,
          region_name_ru:nameRU,
          region_name_en:nameEN,
          id:id
        }
        AxiosInstance.put("/region/update-region",body)
        .then(response=>{
          if(!response.data.error){
            showSuccess("Successfully updated!");
            setLoading(false);
            clearInput();
            handleClose();
            getRegion();
        } else {
            showError("Something went wrong!");
                setLoading(false);
        }
        })
        .catch(error=>{
          showError(error + "");
          setLoading(false);
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
                            <TableCell align="left">{t('Region name turkmen')}</TableCell>
                            <TableCell align="left">{t('Region name russian')}</TableCell>
                            <TableCell align="left">{t('Region name english')}</TableCell>
                            <TableCell align="left">{t('DELETE')}</TableCell>
                            <TableCell align="left">{t('EDIT')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            list.map((element, i) => {
                                return (
                                    <TableRow
                                        key="key"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{element.id}</TableCell>
                                        <TableCell align="left">{element.region_name_tm}</TableCell>
                                        <TableCell align="left">{element.region_name_ru}</TableCell>
                                        <TableCell align="left">{element.region_name_en}</TableCell>
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
                  label={t("Region name turkmen")}
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
                  label={t("Region name russian")}
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
                  label={t("Region name english")}
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

export default HolidayTable
