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
import EventTable from './EventTable';
import { styled } from '@mui/material/styles';
import FileBrowse from '../FileBrowse/FileBrowse';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import { event_types } from '../Constants/Constant.mjs';

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
  display: 'block'
};

function Event() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [isEmpty, setEmpty] = useState(false);


  // Field variables
  const [go_label, setGoLabel] = useState('');
  const [event_type, setEventType] = useState('');
  const [goList, setGoList] = useState([]);
  const [goid,setGoid]= useState(0);
  const [titleTM,setTitleTM]= useState('');
  const [titleRU,setTitleRU]= useState('');
  const [titleEN,setTitleEN]= useState('');
  const [status,setStatus]= useState(1);
  const [isMain,setIsMain]= useState(1);
  const [url,setUrl]= useState('');
  const [image, setImage] = useState('Select image');
  const [file,setFile] = useState('');
  // Field variables

  const clearInput=()=>{
    setGoLabel('');
    setEventType('');
    setGoList([]);
    setGoid(0);
    setTitleTM('');
    setTitleRU('');
    setTitleEN('');
    setStatus(1);
    setIsMain(1);
    setUrl('');
    setImage('Select image');
    setFile('');
  }
  const handleFileInput = (e) => {
    setImage(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  const handleClick = () => {
    addEvent();
  }

  const [selectCategory, setSelectCategory] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    AxiosInstance.get('/event/get-event')
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

  const addEvent=()=>{
    if(titleTM=='' || titleRU=='' || titleEN==''){
      showWarning("Please enter required informations!");
      return;
    }
    let formData = new FormData();
    formData.append('titleTM',titleTM);
    formData.append('titleRU',titleRU);
    formData.append('titleEN',titleEN);
    formData.append('status',status);
    formData.append('isMain',isMain);
    formData.append('url',url);
    formData.append('event_type',event_type);
    formData.append('go_id',goid);
    if(event_type != 'products'){
      formData.append('file',file);
    }
    setLoading(true);
    AxiosInstanceFormData.post('/event/add-event',formData)
    .then(response => {
      if (!response.data.error) {
          showSuccess("Successfully added!");
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


  useEffect(() => {
    setGoid('')
    if (event_type == 'user') {
      setGoLabel('Please wait...');
      getUsers();
    }
    if (event_type == 'single_product') {
      setGoLabel('Enter product id');
      setGoList([]);
    }
    if (event_type == 'products') {
      setGoLabel('');
      setGoList([]);
      setGoid(0)
    }
    if (event_type == 'category') {
      setGoLabel('Please wait...');
      getCategory();
    }
    if (event_type == 'constant') {
      setGoLabel('Please wait...');
      getConstants();
    }
    if (event_type == 'sub_category') {
      setGoLabel('Please wait...');
      getSelectCategory();
    }
  }, [event_type]);

  const getUsers = () => {
    AxiosInstance.get('/user/get-all-users')
      .then(response => {
        setGoLabel('Select user');
        if (!response.data.error) {
          setGoList(response.data.body);
        } else {
          showError("Something went wrong!");

        }
      })
      .catch(error => {
        showError(error + "");
      })
  }

  const getCategory = () => {
    AxiosInstance.get('/category/get-category')
      .then(response => {
        setGoLabel('Select category');
        if (!response.data.error) {
          setGoList(response.data.body);
        } else {
          showError("Something went wrong!");

        }
      })
      .catch(error => {
        showError(error + "");
      })
  }

  const getSelectCategory = () => {
    AxiosInstance.get('/sub-category/get-sub-category?category_id=')
      .then(response => {
        setGoLabel('Select sub category');
        if (!response.data.error) {
          setGoList(response.data.body);
        } else {
          showError("Something went wrong!");

        }
      })
      .catch(error => {
        showError(error + "");
      })
  }


  const getConstants = () => {
    AxiosInstance.get('/constant-page/get-constant')
      .then(response => {
        setGoLabel('Select constant');
        if (!response.data.error) {
          setGoList(response.data.body);
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
          <Grid item lg={6}>
            <h2>Events</h2>
          </Grid>
          <Grid item lg={6}>
            <Stack
              direction={'row'}
              spacing={4}
              justifyContent={'flex-end'}
            >
              <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add event</Button>
            </Stack>
          </Grid>
        </Grid>




        <EventTable getData={getData} list={list} isEmpty={isEmpty} />
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
                  label="Event title turkmen"
                  defaultValue=""
                  value={titleTM}
                  onChange={e=>setTitleTM(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Event title russian"
                  defaultValue=""
                  value={titleRU}
                  onChange={e=>setTitleRU(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Event title english"
                  defaultValue=""
                  value={titleEN}
                  onChange={e=>setTitleEN(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={status}
                    onChange={e=>setStatus(e.target.value)}
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

              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Is Main</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={isMain}
                    onChange={e=>setIsMain(e.target.value)}
                    input={<OutlinedInput label="is main" />}
                  >
                    <MenuItem
                      key="Active"
                      value="1"
                    >
                      Yes
                    </MenuItem>

                    <MenuItem
                      key="Passive"
                      value="0"
                    >
                      No
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  id="outlined-required"
                  label="Event url"
                  defaultValue=""
                  value={url}
                  onChange={e=>setUrl(e.target.value)}
                />
              </Grid>


              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Event type</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={event_type}
                    onChange={e => setEventType(e.target.value)}
                    input={<OutlinedInput label="Event type" />}
                  >
                    {
                      event_types.map((type, i) => {
                        return (
                          <MenuItem
                            key={`keey${i}`}
                            value={type.type}
                          >
                            {type.type}
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>

              {event_type != '' && event_type != 'products' && event_type != 'single_product' ?
                <Grid item md={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-name-label">{go_label}</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={goid}
                      onChange={e=>setGoid(e.target.value)}
                      input={<OutlinedInput label={go_label} />}
                    >
                      {
                        goList.map((go, i) => {
                          return (
                            event_type == 'user' ?
                              <MenuItem
                                key={go.id}
                                value={go.id}
                              >
                                {go.fullname}
                              </MenuItem> :
                              event_type == 'sub_category' ?
                                <MenuItem
                                  key={go.id}
                                  value={go.id}
                                >
                                  {go.sub_category_name_tm}
                                </MenuItem> :
                                event_type == 'category' ?
                                  <MenuItem
                                    key={go.id}
                                    value={go.id}
                                  >
                                    {go.category_name_tm}
                                  </MenuItem> :
                                  event_type == 'constant' ?
                                    <MenuItem
                                      key={go.id}
                                      value={go.id}
                                    >
                                      {go.titleTM}
                                    </MenuItem> : null
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid> : event_type == 'single_product' ?
                  <Grid item md={12} lg={6}>
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label={go_label}
                      defaultValue=""
                      value={goid}
                      type='number'
                      onChange={e=>setGoid(e.target.value)}
                    />
                  </Grid> : null}

              {event_type!='products'?
              <Grid item md={12} lg={12}>
              <label htmlFor="contained-button-file3">
                <Input accept="image/*" id="contained-button-file3" type="file" onChange={handleFileInput} />
                <FileBrowse component="span" image={image}>
                </FileBrowse>
              </label>
            </Grid>:null}


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

export default Event

