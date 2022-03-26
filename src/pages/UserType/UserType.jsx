import { Button, IconButton, OutlinedInput, TextField } from '@mui/material'
import React, { useState,useEffect } from 'react'
import UserTypeTable from './UserTypeTable'
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
import { AxiosInstance } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import { ToastContainer, toast } from 'react-toastify';

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
};

function UserType() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [list, setList] = useState([]);
  const handleClick = () =>{
    addUserType();
  }

  // Field variables
  const[userType,setUserType]=useState('');
  const[limit,setLimit]=useState(0);
  // Field variables

  useEffect(()=>{
    getUserTypes();
  },[]);

  const clearInput=()=>{
    setUserType('');
    setLimit(0);
  }


  const addUserType = () =>{
    if(userType==''){
      showWarning("Please enter required informations");
      return;
    }
    setLoading(true);
    const body = {
      user_type:userType,
      product_limit:limit
    }
    AxiosInstance.post('/user-type/add-user-type',body)
    .then(response=>{
      if(!response.data.error){
        showSuccess("Successfully added!");
        setLoading(false);
        clearInput();
        handleClose();
        getUserTypes();
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

  const getUserTypes=()=>{
    AxiosInstance.get('/user-type/get-user-type')
    .then(response => {
      if (!response.data.error) {
        setList(response.data.body);
        if (typeof response.data.body === 'undefined' || response.data.body.length == 0) {
          setEmpty(true);
        } else {
          setEmpty(false);
        }
      } else {
        showError("Something went wrong!");
        if (list.length == 0) {
          setEmpty(true);
        }

      }
    })
    .catch(error => {
      if (list.length == 0) {
        setEmpty(true);
      }
      showError(error + "");
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
                        <h2>User types</h2>
                    </Grid>
                    <Grid item lg={6}>
                        <Stack
                            direction={'row'}
                            spacing={4}
                            justifyContent={'flex-end'}
                        >
                            <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add user type</Button>
                        </Stack>
                    </Grid>
                </Grid>


        <UserTypeTable getUserTypes={getUserTypes} isEmpty={isEmpty} list={list} />
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
                  label="User type"
                  defaultValue=""
                  value={userType}
                  onChange={e=>setUserType(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Product Limit"
                  defaultValue=""
                  type="number"
                  value={limit}
                  onChange={e=>setLimit(e.target.value)}
                />
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
      {/* End of modal add */}

    </div>
  )
}

export default UserType

