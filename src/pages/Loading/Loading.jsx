import React from 'react'
import ReactLoading from 'react-loading';
import colors from '../../constants/colors';

const Loading = () => {
  return (
    <div>
      <br/>
      <br/>
      <br/>
      <center><ReactLoading type={'spokes'} color={colors.orange} height={50} width={50} /></center>
    </div>
  )
}

export default Loading
