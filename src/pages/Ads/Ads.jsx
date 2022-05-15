import { Button, FormHelperText, IconButton, OutlinedInput, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
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
import AdsTable from './AdsTable';
import { styled } from '@mui/material/styles';
import FileBrowse from '../FileBrowse/FileBrowse';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import { ads_status } from '../Constants/Constant.mjs';
import { useTranslation } from '../../components/sidebar/Sidebar';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

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
  overflow: 'scroll',
  height: '90%',
  display: 'block',
  overflowX: 'hidden'
};

function Ads() {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [image, setImage] = useState('Select image');
  const [constants, setConstants] = useState([]);
  const [list, setList] = useState([]);
  const [isEmpty, setEmpty] = useState(false);
  const [constant_id, setConstantId] = useState('');
  const [site_url, setUrl] = useState('');
  const [status, setStatus] = useState(1);
  const [selectedFile, setFile] = useState('');


  const handleFileInput = (e) => {
    setImage(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  const clearInput = () => {
    setConstantId('');
    setUrl('');
    setStatus(1);
    setFile('');
    setImage('Select image');
  }

  const handleClick = () => {
    if (selectedFile == '') {
      showWarning("Enter all required information");
      return;
    }
    setLoading(true);
    let formData = new FormData();
    formData.append('ads_image', selectedFile);
    formData.append('constant_id', constant_id);
    formData.append('site_url', site_url);
    formData.append('status', status);
    AxiosInstanceFormData.post('/ads/add-ads', formData)
      .then(response => {
        if (!response.data.error) {
          showSuccess(t("Successfully added!"));
          setLoading(false);
          clearInput();
          handleClose();
          getData();
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


 

  useEffect(() => {
    getData();
  },[]);

  useEffect(() => {
    getConstants();
  },[])


  const getConstants=()=>{
    AxiosInstance.get('/constant-page/get-constant')
    .then(response=>{
      if (!response.data.error) {
        setConstants(response.data.body);
      } else {
        showError(t("Something went wrong!"));
      }
    })
    .catch(err=>{
      showError(err+"");
    })
  }


 

  const getData = () => {
    AxiosInstance.get('/ads/get-ads')
      .then(response => {
        if (!response.data.error) {
          setList(response.data.body);
          if (typeof response.data.body === 'undefined' || response.data.body.length == 0) {
            setEmpty(true);
          } else {
            setEmpty(false);
          }
        } else {
          showError(t("Something went wrong!"));
          if (typeof list.length === 'undefined' || list.length == 0) {
            setEmpty(true);
          }

        }
      })
      .catch(error => {
        showError(error + " while getting sub categories");
        if (typeof list.length === 'undefined' || list.length == 0) {
          setEmpty(true);
        }
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
         
          <Grid item lg={12} xs={12}>
            <Stack
              direction={'row'}
              spacing={4}
              justifyContent={'flex-end'}
            >
              <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>{t('Add ads')}</Button>
            </Stack>
          </Grid>
        </Grid>




        <AdsTable getData={getData} list={list} isEmpty={isEmpty} constants={constants} />
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
                  label={t('Site URL')}
                  defaultValue=""
                  value={site_url}
                  onChange={e => setUrl(e.target.value)}
                />
              </Grid>

              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">{t('Status')}</InputLabel>
                  <Select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    input={<OutlinedInput label={t('Status')} />}
                  >
                  

                    {
                      ads_status.map((st,i)=>{
                        return(
                          <MenuItem
                            key={`keeyy${i}`}
                            value={st.label}
                          >
                            {st.label}
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
                  <InputLabel id="demo-multiple-name-label">{t('Constant id')}</InputLabel>
                  <Select
                    value={constant_id}
                    onChange={e => setConstantId(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    input={<OutlinedInput label={t('Constant')} />}
                  >
                    {
                      constants?.map((element, i) => {
                        return (
                          <MenuItem key={i} value={element.id}>
                            {element.titleRU}
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={12} lg={6}>
              </Grid>
              <Grid item md={12} lg={12}>
                <label htmlFor="contained-button-file3">
                  <Input accept="image/*" id="contained-button-file3" type="file" onChange={handleFileInput} />
                  <FileBrowse component="span" image={image}>
                  </FileBrowse>
                </label>
              </Grid>

              <Grid item md={12} lg={12}>
                {
                  <LoadingButton
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
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

export default Ads

