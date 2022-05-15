import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import { Send, SendTwoTone } from '@mui/icons-material';
import { AxiosInstance } from '../Axios/AxiosInstance';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UrlGuide from '../Guide/UrlGuide';
import { useTranslation} from '../../components/sidebar/Sidebar';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Push() {
  const {t} = useTranslation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('?');
  const [isLoading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState(0);
  const [sendAll, setSendAll] = useState(true);
  useEffect(() => {
    if (url.length == 0) {
      setUrl('?');
    }
  }, [url]);

  const handleClick = () => {
    if (sendAll) {
      pushToTopic();
    } else {
      pushToToken();
    }
  }

  const pushToTopic = () => {
    if (title == '' || body == '') {
      showWarning("Please enter required informations");
      return;
    }
    const pushBody = {
      title: title,
      body: body,
      data: {
        url: url
      }
    }
    setLoading(true);
    AxiosInstance.post('/push/push-to-topic', pushBody)
      .then(response => {
        if (!response.data.error) {
          setTitle("");
          setBody("");
          setUrl("");
          setSendAll(true);
          setUser(0);
          showSuccess("Successfully sent!");

        } else {
          showError("Something went wrong!");
        }
        setLoading(false);
      })
      .catch(err => {
        showError(err + "");
        setLoading(false);
      })
  }

  const pushToToken = () => {
    if (title == '' || body == '' || user == '0') {
      showWarning("Please enter required informations");
      return;
    }
    const pushBody = {
      title: title,
      body: body,
      token: user,
      data: {
        url: url
      }
    }
    setLoading(true);
    AxiosInstance.post('/push/push-to-token', pushBody)
      .then(response => {
        if (!response.data.error) {
          setTitle("");
          setBody("");
          setUrl("");
          setSendAll(true);
          setUser(0);
          showSuccess("Successfully sent!");
        } else {
          showError("Something went wrong!");
        }
        setLoading(false);
      })
      .catch(err => {
        showError(err + "");
        setLoading(false);
      })
  }

  useEffect(() => {
    getUsers();
  }, [])

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
      <h2>{t('Push')}</h2>

      <br />
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            label={t("Title")}
            id="standard-size-normal"
            defaultValue=""
            variant="standard"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            label={t("Body")}
            id="standard-size-normal"
            defaultValue=""
            variant="standard"
            value={body}
            onChange={e => setBody(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={12}>
          <TextField
            fullWidth
            label={t("URL")}
            id="standard-size-normal"
            defaultValue="?"
            helperText={t('url_must')}
            variant="standard"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <UrlGuide/>
        </Grid>
        <Grid item xs={12} lg={12}>
          <label>{t('Send all')}</label><br />
          <input type="checkbox" checked={sendAll} onChange={e => setSendAll(!sendAll)} />
        </Grid>
        <Grid item xs={12} lg={4}>
          {
            !sendAll ?
              <div>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-name-label">{t('Select user:')}</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    input={<OutlinedInput label={t('User')} />}
                  >
                    {
                      userList.map((user, i) => {
                        return (
                          <MenuItem
                            key={user.id}
                            value={user.notification_token}
                          >
                            {user.fullname}
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </div> : null

          }
        </Grid>

        <Grid item lg={12}>
          <Stack justifyContent={'flex-end'} alignItems={'flex-end'}>
            {
              <LoadingButton
                loading={isLoading}
                loadingPosition="start"
                startIcon={<SendTwoTone />}
                variant="contained"
                width="40%"
                color='success'
                onClick={handleClick}
              >
                {isLoading ? <Typography variant="action">{t('Please wait...')}</Typography> : <Typography variant="action">{t('Send')}</Typography>}
              </LoadingButton>

            }
          </Stack>
        </Grid>


      </Grid>

    </div>
  )
}

export default Push
