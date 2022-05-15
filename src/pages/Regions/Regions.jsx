import { Button, IconButton, OutlinedInput, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import RegionsTable from './RegionsTable';
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
import {useTranslation} from '../../components/sidebar/Sidebar';
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

function Regions() {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [list, setList] = useState([]);
  const handleClick = () => {
    AddRegion();
  }

  useEffect(() => {
    getRegion();
  }, []);

  // Field variables
  const [nameTM, setNameTM] = useState('');
  const [nameRU, setNameRU] = useState('');
  const [nameEN, setNameEN] = useState('');
  // Field variables


  const clearInput=() => {
    setNameTM("");
    setNameRU("");
    setNameEN("");
  }

  const getRegion = () => {
    AxiosInstance.get('/region/get-region')
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

  const AddRegion=()=>{
    if(nameTM=='' || nameRU=='' || nameEN==''){
      showWarning("Please enter required information!");
      return;
    }
    setLoading(true);
    const body = {
      region_name_tm:nameTM,
      region_name_ru:nameRU,
      region_name_en:nameEN,
    }
    AxiosInstance.post("/region/add-region",body)
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
      <ToastContainer />
      <Stack
        direction={'column'}
        spacing={4}
      >
        <Grid container spacing={0}>
          <Grid item lg={6}>
            <h2>{t('Regions')}</h2>
          </Grid>
          <Grid item lg={6}>
            <Stack
              direction={'row'}
              spacing={4}
              justifyContent={'flex-end'}
            >
              <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>{t('Add Region')}</Button>
            </Stack>
          </Grid>
        </Grid>


        <RegionsTable list={list} isEmpty={isEmpty} getRegion={getRegion} />
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
                  label={t('Region name turkmen')}
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
                  label={t('Region name russian')}
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
                  label={t('Region name english')}
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
                    {isLoading ? <Typography variant="action">{t('Please wait...')}</Typography> : <Typography variant="action">{t('Add')}</Typography>}
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

export default Regions

