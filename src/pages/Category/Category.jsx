import { Button, IconButton, OutlinedInput, TextField, FormControlLabel } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CategoryTable from './CategoryTable'
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
import Checkbox from '@mui/material/Checkbox';
import { AxiosInstance } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import FileBrowse from '../FileBrowse/FileBrowse';
import { styled } from '@mui/material/styles';

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
};

function Category() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [isEmpty, setEmpty] = useState(false);
  const [name_tm,setNameTm]= useState(''); 
  const [name_ru,setNameRu]= useState(''); 
  const [name_en,setNameEn]= useState(''); 
  const [status,setStatus] = useState(1);
  const [isMain,setMain] = useState(false);
  const [image, setImage] = useState('Select image');
  const [selectedFile, setFile] = useState('');

  const handleClick = () => {
    addCategory();
  }

  const handleFileInput = (e) => {
    setImage(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  const clearInput= () => {
    setNameTm('');
    setNameRu('');
    setNameEn('');
    setStatus(1);
    setImage('Select image');
    setFile('');
    setMain(false);
  }

  const addCategory = () => {
    if(name_tm=='' || name_ru=='' || name_en == '' || selectedFile==''){
      showWarning("Enter all required information");
        return;
    }
    setLoading(!isLoading);
    let category=new FormData();
    category.append('nameTM',name_tm);
    category.append('nameRU',name_ru);
    category.append('nameEN',name_en);
    category.append('status',status);
    category.append('isMain',isMain);
    category.append('file',selectedFile);

    AxiosInstance.post('/category/add-category',category)
    .then(response=>{
      if(!response.data.error){
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
    .catch(error=>{
      showError(error + "");
      setLoading(false);
    })
  }

  const getData = () => {
    AxiosInstance.get('/category/get-category')
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Stack
        direction={'column'}
        spacing={4}
      >
        <Grid container spacing={0}>
          <Grid item lg={6}>
            <h2>Category</h2>
          </Grid>
          <Grid item lg={6}>
            <Stack
              direction={'row'}
              spacing={4}
              justifyContent={'flex-end'}
            >
              <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add Category</Button>
            </Stack>
          </Grid>
        </Grid>


        <CategoryTable getData={getData} list={list} isEmpty={isEmpty} />
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
                  label="Category name turkmen"
                  defaultValue=""
                  onChange={e=>setNameTm(e.target.value)}
                  value={name_tm}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Category name russian"
                  defaultValue=""
                  onChange={e=>setNameRu(e.target.value)}
                  value={name_ru}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Category name english"
                  defaultValue=""
                  onChange={e=>setNameEn(e.target.value)}
                  value={name_en}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    onChange={e=>setStatus(e.target.value)}
                    value={status}
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
              <Grid item md={12} lg={12}>
                <label htmlFor="contained-button-file3">
                  <Input accept="image/*" id="contained-button-file3" type="file" onChange={handleFileInput} />
                  <FileBrowse component="span" image={image}>
                  </FileBrowse>
                </label>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={4} lg={4}>
                <FormControlLabel style={{ marginLeft: '5px' }} control={<Checkbox defaultChecked onChange={e=>setMain(!isMain)}
                  value={isMain} checked={isMain} />} label="is Main" />
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

export default Category

