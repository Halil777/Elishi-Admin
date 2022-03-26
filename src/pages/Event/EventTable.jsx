import React, { useState,useEffect } from 'react'
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
import './event_table.css';
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
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { data } from '../../constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { server_ip } from '../Axios/AxiosInstance';
import { checkStatus } from '../Constants/Constant.mjs';
import FileBrowse from '../FileBrowse/FileBrowse';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import { event_types } from '../Constants/Constant.mjs';
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';

const Input = styled('input')({
    display: 'none',
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'white',
    border: '2px solid transparent',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
    height: '100%',
    display: 'block'
};

function EventTable({list,getData,isEmpty}) {
    const [categoryList, setCategoryList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => setOpen(false);
    const [isFirst,setFirst] = useState(true);


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
      const [id,setId] = useState('');
      const [eventProducts,setEventProducts] = useState([]);
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
    setId('');
    setFirst(true);
    setEventProducts([]);
  }
  const handleFileInput = (e) => {
    setImage(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  const handleOpen = (element) => {
      setOpen(true);
      setEventType(element.event_type);
      setGoid(element.go_id);
      setTitleTM(element.title_tm);
      setTitleRU(element.title_ru);
      setTitleEN(element.title_en);
      setStatus(element.status);
      setIsMain(element.isMain);
      setUrl(element.url);
      setImage(element.event_image);
      setFile('');
      setId(element.id);
      setFirst(true);
  }


    const [isLoading, setLoading] = useState(false);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateEvent();
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this event?")) {
            deleteEvent(element);
        }
    };

    const confirmEventDialog = async (id) => {
      if (window.confirm("Do you want delete this product from event?")) {
          deleteEventProduct(id);
      }
  };

  const deleteEventProduct=(d_id)=>{
    AxiosInstance.delete('/event/delete-event-products/'+d_id)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully deleted!");
                    getEventProducts(id);
                } else {
                    showError("Something went wrong!");
                }
            })
            .catch(err => {
                showError(err + "");
            })
  }

    const deleteEvent = async (element) => {
        AxiosInstance.delete('/event/delete-event/' + element.id + "?filename=" + element.event_image)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully deleted!");
                    getData();
                } else {
                    showError("Something went wrong!");
                }
            })
            .catch(err => {
                showError(err + "");
            })
    }


    const updateEvent=()=>{
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
        formData.append('id',id);
        if(event_type != 'products' && file!=''){
          formData.append('file',file);
        }
        setLoading(true);
        AxiosInstanceFormData.put('/event/update-event',formData)
        .then(response => {
          if (!response.data.error) {
              showSuccess("Successfully updated!");
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
        if(!isFirst){
          setGoid('');
        }
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
          setGoid(0);
          getEventProducts(id);
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
        setFirst(false);
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

      const getEventProducts=(id)=>{
        AxiosInstance.get('/event/get-event-product?event_id='+id)
        .then(response => {
          if (!response.data.error) {
            setEventProducts(response.data.body);
          } else {
            showError("Something went wrong!");
          }
        })
        .catch(error => {
          showError(error + "");
        })
      }

      const getFirstImage = (images) => {
        let tempImgs = images.filter(img => img.is_first == true);
        if (typeof tempImgs === 'undefined' || tempImgs.length == 0 || tempImgs == null) {
            return '';
        }
        return tempImgs[0].small_image;
    }




    return (

        <div>
        {((typeof list === 'undefined' || list.length <= 0) && !isEmpty) ? <Loading /> : ((typeof list === 'undefined' || list.length <= 0) && isEmpty) ? <Empty /> :
                
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Event title TM</TableCell>
                            <TableCell align="left">Image</TableCell>
                            <TableCell align="left">Type</TableCell>
                            <TableCell align="left">Status</TableCell>
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
                                        <TableCell align="left">{element.title_tm}</TableCell>
                                        <TableCell align="left"> <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + element.event_image} className="img" /></TableCell>
                                        <TableCell align="left">{element.event_type}</TableCell>
                                        <TableCell align="left">{checkStatus(element.status).label}</TableCell>
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
                    startIcon={<EditIcon />}
                    variant="contained"
                    fullWidth={true}
                    onClick={handleClick}
                  >
                    {isLoading ? <p style={{ color: "white" }}>Please wait...</p> : <p style={{ color: "white" }}>Edit</p>}
                  </LoadingButton>

                }

              </Grid>

           

  {/* Products table */}
  {eventProducts.length<=0?null:
             <Grid item md={12} lg={12}>
               <center><p>Event products</p></center>
               <br/>
               <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell align="left">Product image</TableCell>
                                    <TableCell align="left">Product name</TableCell>
                                    <TableCell align="left">Price</TableCell>
                                    <TableCell align="left">Size</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="left">DELETE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    eventProducts.map((element, i) => {
                                        let color=checkStatus(element.product[0].status).color;
                                        return (
                                            <TableRow
                                                style={{ background:color}}
                                                key={element.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0} }
                                            }
                                            >
                                                <TableCell component="th" scope="row">{element.product[0].id}</TableCell>
                                                <TableCell align="left">{element.images != null ? <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + getFirstImage(element.images)} className="img" />
                                                    : <img src={data.user.placeholder} className="img" />
                                                }</TableCell>
                                                <TableCell align="left">{element.product[0].product_name}</TableCell>
                                                <TableCell align="left">{element.product[0].price} TMT</TableCell>
                                                <TableCell align="left">{element.product[0].size}</TableCell>
                                                <TableCell align="left">{checkStatus(element.product[0].status).label}</TableCell>
                                                <TableCell align="left"> <IconButton aria-label="delete" color="secondary" onClick={() => confirmEventDialog(element.id)}><DeleteIcon /></IconButton></TableCell>
                                            </TableRow>
                                        )
                                    })
                                }



                            </TableBody>
                        </Table>
                    </TableContainer>
             </Grid>
             }

             
            </Grid>

           

                    </Stack>
                </Box>
            </Modal>
            {/* End of modal edit */}
        </div>
    )
}

export default EventTable
