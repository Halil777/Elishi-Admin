import { Button, FormHelperText, IconButton, OutlinedInput, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
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
import CongratulationsTable from './CongratulationsTable';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import FileBrowse from '../FileBrowse/FileBrowse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProductLimit } from '../Constants/Constant.mjs';

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

function Congratulations() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [holidays, setholidays] = useState([]);
  const [isEmptyPage, setEmptyPage] = useState(false);
  const [page_count, setPageCount] = useState(0);
  const [congratulations, setCongratulations] = useState([]);
  const [usersList, setUserList] = useState([]);
  const handleClick = () => {
    addCongratulation();
  }

  // Field variables
  const [title,setTitle] = useState('');
  const [holiday, setHoliday] = useState('');
  const [selectedUser,setSelectedUser] = useState('');
  const [status,setStatus] = useState('');
  const [text,setText] = useState('');
  // Field variables

  useEffect(() => {
    getHoliday();
    getUsers();
  }, []);

  const clearInput=()=>{
    setTitle('');
    setHoliday('');
    setSelectedUser('');
    setStatus('');
    setText('');
  }

  const [selectedHoliday, setSelectHoliday] = useState('');
  

  const getHoliday = () => {
    AxiosInstance.get('/holiday/get-holiday')
      .then(response => {
        if (!response.data.error) {
          setholidays(response.data.body);
        } else {
          showError("Something went wrong!");
        }
      })
      .catch(error => {
        showError(error + "");
      })
  }

  useEffect(() => {
    getCongratulations(1);
  }, [selectedHoliday]);

  const getCongratulations = (page) => {
    AxiosInstance.get('/congratulation/get-congratulation?limit=' + ProductLimit + '&page=' + page + '&holiday=' + selectedHoliday)
      .then(response => {
        if (!response.data.error) {
          setCongratulations(response.data.body.congratulations);
          if (page == 1)
            setPageCount(response.data.body.page_count)
          if (typeof response.data.body.congratulations === 'undefined' || response.data.body.congratulations.length == 0) {
            setEmptyPage(true);
          } else {
            setEmptyPage(false);
          }
        } else {
          showError("Something went wrong!");
          if (congratulations.length == 0) {
            setEmptyPage(true);
          }

        }
      })
      .catch(error => {
        showError(error + "");
        if (congratulations.length == 0) {
          setEmptyPage(true);
        }
      })
  }

  const addCongratulation=()=>{
    if(title=='' || text=='') {
      showWarning('Please enter all required information');
      return;
    }
    setLoading(true);
    const body = {
      title:title,
      holiday:holiday,
      user:selectedUser,
      status:status,
      text:text
    };
    AxiosInstance.post('/congratulation/add-congratulation',body)
    .then(response => {
      if (!response.data.error) {
          showSuccess("Successfully added!");
          setLoading(false);
          clearInput();
          handleClose();
          getCongratulations(1);
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


  const getUsers = () => {
    AxiosInstance.get('/user/get-all-users')
      .then(response => {
        if (!response.data.error) {
          setUserList(response.data.body);
        } else {
          showError("Something went wrong!");

        }
      })
      .catch(error => {
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
          <Grid item lg={3} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-helper-label">Holiday filter</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selectedHoliday}
                label="Holiday filter"
                onChange={e => setSelectHoliday(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {
                  holidays?.map((holiday) => {
                    return (
                      <MenuItem value={holiday.id}>
                        {holiday.holiday_name_tm}
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={9} xs={12}>
            <Stack
              direction={'row'}
              spacing={4}
              justifyContent={'flex-end'}
            >
              <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add Congratulations</Button>
            </Stack>
          </Grid>
        </Grid>




        <CongratulationsTable holidays={holidays} usersList={usersList} page_count={page_count} isEmptyPage={isEmptyPage} congratulations={congratulations} getCongratulations={getCongratulations} />
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
                  label="Title"
                  defaultValue=""
                  value={title}
                  onChange={e=>setTitle(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Holiday</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={holiday}
                    onChange={e=>setHoliday(e.target.value)}
                    input={<OutlinedInput label="Holiday" />}
                  >
                    {
                      holidays?.map((holiday) => {
                        return (
                          <MenuItem key={`keyy${holiday.id}`} value={holiday.id}>
                            {holiday.holiday_name_tm}
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
                  <InputLabel id="demo-multiple-name-label">User</InputLabel>
                  <Select
                    value={selectedUser}
                    onChange={e=>setSelectedUser(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    input={<OutlinedInput label="User" />}
                  >
                    {
                      usersList.map((user) => {
                        return (
                          <MenuItem
                            key={`keeey${user.id}`}
                            value={user.id}
                          >
                            {user.fullname}
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                  <Select
                    value={status}
                    onChange={e=>setStatus(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
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
              <Grid item md={12} lg={12}>
                <TextField
                  fullWidth
                  id="filled-textarea"
                  label="Text"
                  placeholder="Enter Text..."
                  multiline
                  rows={6}
                  variant="filled"
                  value={text}
                  onChange={e=>setText(e.target.value)}
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

export default Congratulations

