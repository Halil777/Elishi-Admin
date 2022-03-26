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
import BlockTable from './BlockTable';
import { styled } from '@mui/material/styles';
import FileBrowse from '../FileBrowse/FileBrowse';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';

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

function Block() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [image, setImage] = useState('Select image');
  const [categoryList, setCategoryList] = useState([]);
  const [list, setList] = useState([]);
  const [isEmpty, setEmpty] = useState(false);
  const [name_tm, setNameTm] = useState('');
  const [name_ru, setNameRu] = useState('');
  const [name_en, setNameEn] = useState('');
  const [status, setStatus] = useState(1);
  const [category, setCategory] = useState('');
  const [selectedFile, setFile] = useState('');


  const handleFileInput = (e) => {
    setImage(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  const clearInput = () => {
    setNameTm('');
    setNameRu('');
    setNameEn('');
    setStatus(1);
    setCategory('');
    setFile('');
    setImage('Select image');
  }

  const handleClick = () => {
    if (name_tm == '' || name_ru == '' || name_en == '' || category == '' || selectedFile == '') {
      showWarning("Enter all required information");
      return;
    }
    setLoading(true);
    let formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('nameTM', name_tm);
    formData.append('nameRU', name_ru);
    formData.append('nameEN', name_en);
    formData.append('status', status);
    formData.append('category', category);
    AxiosInstanceFormData.post('/sub-category/add-sub-category', formData)
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

  const [selectCategory, setSelectCategory] = useState('');



  useEffect(() => {
    getData();
  }, [selectCategory])




  const getData = () => {
    AxiosInstance.get('/block/get-blocked-list')
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



  return (
    <div>
      <ToastContainer />
      <Stack
        direction={'column'}
        spacing={4}
      >

        <Grid container spacing={0}>
          <Grid item lg={3} xs={12}>
            <h2>Block List</h2>
          </Grid>
          <Grid item lg={9} xs={12}>
            <Stack
              direction={'row'}
              spacing={4}
              justifyContent={'flex-end'}
            >
              <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add to Black list</Button>
            </Stack>
          </Grid>
        </Grid>




        <BlockTable getData={getData} list={list} isEmpty={isEmpty} categoryList={categoryList} />
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
                  label="Sub Category name turkmen"
                  defaultValue=""
                  value={name_tm}
                  onChange={e => setNameTm(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Sub Category name russian"
                  defaultValue=""
                  value={name_ru}
                  onChange={e => setNameRu(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Sub Category name english"
                  defaultValue=""
                  value={name_en}
                  onChange={e => setNameEn(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                  <Select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
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

              <Grid item md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">Category</InputLabel>
                  <Select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    input={<OutlinedInput label="Status" />}
                  >
                    {
                      categoryList?.map((element, i) => {
                        return (
                          <MenuItem key={i} value={element.id}>
                            {element.category_name_tm}
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

export default Block

