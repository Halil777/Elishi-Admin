import React,{useState,useEffect} from 'react'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import { Save, Send, SendTwoTone } from '@mui/icons-material';
import { AxiosInstance } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { androidVersionRequired, androidVersionType, iosVersionRequired, iosVersionType } from '../Constants/Constant.mjs';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function Settings() {
  const [isLoading, setLoading] = useState(false);
  const [androidVersion,setAndroidVersion]=useState('1');
  const [iosVersion,setIosVersion]=useState('1');
  const [iosRequired,setIosRequired]=useState('1');
  const [androidRequired,setAndroidRequired]=useState('1');
  const handleClick = () => {
    if(androidVersion=='' || iosVersion=='' || iosRequired=='' || androidRequired==''){
      showWarning('Please enter all required information!');
      return;
    }
    sendSettings(androidVersionType,androidVersion,1);
    sendSettings(iosVersionType,iosVersion,2);
    sendSettings(androidVersionRequired,androidRequired,3);
    sendSettings(iosVersionRequired,iosRequired,4);
  }

  const sendSettings = async (type, value,index) => {
    setLoading(true);
    await AxiosInstance.put('/vars/update-var',{
      type: type,
      value:value
    }).then(response => {
      if(!response.data.error){
        if(index==4){
          showSuccess("Successfully saved");
          setLoading(false);
        }
      } else {
        showError("Error saving variables");
        setLoading(false);
      }
    })
    .catch(err => {
      showError('Could not send settings');
      setLoading(false);
    })

  }

  useEffect(() => {
    getVars();
  },[]);

  const getVars=()=>{
    AxiosInstance.get('/vars/get-vars')
    .then(response=>{
      if(!response.data.error){
        response.data.body.map((value,i)=>{
          if(value.type==androidVersionType){
            setAndroidVersion(value.value);
          }
          if(value.type==iosVersionType){
            setIosVersion(value.value);
          }
          if(value.type==androidVersionRequired){
            setAndroidRequired(value.value);
          }
          if(value.type==iosVersionRequired){
            setIosRequired(value.value);
          }
        })
      } else {
        showError("Something went wrong");
      }
    })
    .catch(err=>{
      showError(err+"");
    })
  }
  return (
    <div>
      <ToastContainer/>
      <h2>Settings</h2>

    <br/>
     <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
            <TextField
            fullWidth
            label="Android required version"
            id="standard-size-normal"
            defaultValue="1"
            variant="standard"
            value={androidVersion}
            onChange={e=>setAndroidVersion(e.target.value)}
            />
        </Grid>

        <Grid item xs={12} lg={6}>
            <TextField
            fullWidth
            label="IOS required version"
            id="standard-size-normal"
            defaultValue="1"
            variant="standard"
            value={iosVersion}
            onChange={e=>setIosVersion(e.target.value)}
            />
        </Grid>

        <Grid item xs={12} lg={6}>
            <TextField
            fullWidth
            label="Android version requirement"
            id="standard-size-normal"
            defaultValue="1"
            variant="standard"
            value={androidRequired}
            onChange={e=>setAndroidRequired(e.target.value)}
            />
        </Grid>

        <Grid item xs={12} lg={6}>
            <TextField
            fullWidth
            label="IOS version requirement"
            id="standard-size-normal"
            defaultValue="1"
            variant="standard"
            value={iosRequired}
            onChange={e=>setIosRequired(e.target.value)}
            />
        </Grid>

        <Grid item lg={12}>
            <Stack justifyContent={'flex-end'} alignItems={'flex-end'}>
              {
                  <LoadingButton
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<Save />}
                    variant="contained"
                    width="40%"
                    color='success'
                    onClick={handleClick}
                  >
                    {isLoading ? <p style={{ color: "white" }}>Please wait...</p> : <p style={{ color: "white" }}>Save</p>}
                  </LoadingButton>

                }
            </Stack>
        </Grid>


     </Grid>
      
    </div>
  )
}

export default Settings
