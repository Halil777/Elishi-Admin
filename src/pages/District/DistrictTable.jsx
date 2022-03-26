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
import './district.css';
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
import { AxiosInstance } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';

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

const DistrictTable=({ list, isEmpty, getRegion,regions })=> {
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    const [isLoading, setLoading] = useState(false);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    
    // Field variables
    const [nameTM, setNameTM] = useState('');
    const [nameRU, setNameRU] = useState('');
    const [nameEN, setNameEN] = useState('');
    const [region,setRegion] = useState('');
    const [id, setId] = useState('');
    // Field variables

    // Field variables
    const handleOpen = (element) => {
        setOpen(true);
        setNameTM(element.district_name_tm);
        setNameRU(element.district_name_ru);
        setNameEN(element.district_name_en);
        setId(element.id);
        setRegion(element.region_id);
    }

    const clearInput=() => {
        setNameTM("");
        setNameRU("");
        setNameEN("");
        setRegion('');
        setId('');
      }
    
    const handleClick = () => {
        UpdateRegion();
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this district?")) {
            deleteRegion(element.id)
        }
    };

    const deleteRegion=(id)=>{
        AxiosInstance.delete('/district/delete-district/'+id)
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
          district_name_tm:nameTM,
          district_name_ru:nameRU,
          district_name_en:nameEN,
          region_id:region,
          id:id
        }
        AxiosInstance.put("/district/update-district",body)
        .then(response=>{
          if(!response.data.error){
            showSuccess("Successfully added!");
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
                            <TableCell align="left">Name TM</TableCell>
                            <TableCell align="left">Name RU</TableCell>
                            <TableCell align="left">Name EN</TableCell>
                            <TableCell align="left">Region</TableCell>
                            <TableCell align="left">DELETE</TableCell>
                            <TableCell align="left">EDIT</TableCell>
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
                                        <TableCell align="left">{element.district_name_tm}</TableCell>
                                        <TableCell align="left">{element.district_name_ru}</TableCell>
                                        <TableCell align="left">{element.district_name_en}</TableCell>
                                        <TableCell align="left">{element.region_name_tm}</TableCell>
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
                        <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="District name turkmen"
                  defaultValue=""
                  value={nameTM}
                  onChange={e=>setNameTM(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="District name russian"
                  defaultValue=""
                  value={nameRU}
                  onChange={e=>setNameRU(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="District name english"
                  defaultValue=""
                  value={nameEN}
                  onChange={e=>setNameEN(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Region</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={region}
                    onChange={e=>setRegion(e.target.value)}
                    input={<OutlinedInput label="Region" />}
                  >
                    {regions.map((region,i)=>{
                        return(
                          <MenuItem
                            key={`keeey${region.id}`}
                            value={region.id}
                          >
                            {region.region_name_tm}
                          </MenuItem>
                        )
                    })}
                    

                  </Select>
                </FormControl>
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

export default DistrictTable
