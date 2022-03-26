import { Button, IconButton, OutlinedInput, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
import HolidayTable from './HolidayTable'
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
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import FileBrowse from '../FileBrowse/FileBrowse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function Holiday() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [nameTM, setNameTM] = useState('');
  const [nameRU, setNameRU] = useState('');
  const [nameEN, setNameEN] = useState('');
  const [holidays, setholidays] = useState([]);
  const [isEmptyPage, setEmptyPage] = useState(false);
  const handleClick = () => {
    addHoliday();
  }

  const clearInput = () => {
    setNameTM('');
    setNameRU('');
    setNameEN('');
  }

  useEffect(() => {
    getHoliday();
  }, [])


  const getHoliday = () => {
    AxiosInstance.get('/holiday/get-holiday')
      .then(response => {
        if (!response.data.error) {
          setholidays(response.data.body);
          if (typeof response.data.body === 'undefined' || response.data.body == 0) {
            setEmptyPage(true);
          } else {
            setEmptyPage(false);
          }
        } else {
          showError("Something went wrong!");
          if (holidays.length == 0) {
            setEmptyPage(true);
          }

        }
      })
      .catch(error => {
        showError(error + "");
        if (holidays.length == 0) {
          setEmptyPage(true);
        }
      })
  }

  const addHoliday = () => {
    if (nameTM == "" || nameRU == "" || nameEN == "") {
      showWarning("Please enter all required fields!");
      return;
    }
    const body = {
      nameTM: nameTM,
      nameRU: nameRU,
      nameEN: nameEN
    };
    setLoading(true);
    AxiosInstance.post("/holiday/add-holiday", body)
      .then(response => {
        if (!response.data.error) {
          showSuccess("Successfully added!");
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
      <ToastContainer />
      <Stack
        direction={'column'}
        spacing={4}
      >
        <Grid container spacing={0}>
          <Grid item lg={6}>
            <h2>Holiday</h2>
          </Grid>
          <Grid item lg={6}>
            <Stack
              direction={'row'}
              spacing={4}
              justifyContent={'flex-end'}
            >
              <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add Holiday</Button>
            </Stack>
          </Grid>
        </Grid>


        <HolidayTable holidays={holidays} getHoliday={getHoliday} isEmptyPage={isEmptyPage} />
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
      {/* End of modal add */}

    </div>
  )
}

export default Holiday

