import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const CustomSwitch = styled((props) => (
  <Switch
    checked={props.checked}
    onChange={props.onChange}
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  width: '3.7rem',
  height: '2.25rem',
  padding: 0,
  [theme.breakpoints.between('md', 'lg')]: {
    width: '3.45rem', // Smaller width on small screens
    height: '2.1rem',
  },
  '& .MuiFormControlLabel-root': {
    margin: '0 !important',
  },
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '0.15rem',
    [theme.breakpoints.between('md', 'lg')]: {
      margin: '0.125rem',
    },
    transitionDuration: '300ms',
    '&.Mui-checked': {
      margin: '0.15rem -0.12rem',
      transform: 'translateX(1.15rem)',

      [theme.breakpoints.between('md', 'lg')]: {
        margin: '0.14rem 0.2rem',
      },
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
      '&.MuiSwitch-thumb': {
        marginLeft: '0.65rem !important ',
      },
    },
    '&.Mui-checked .MuiSwitch-thumb': {
      marginLeft: '0.7rem !important',
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    // boxSizing: "border-box",
    width: '1.8rem',
    height: '1.8rem',

    [theme.breakpoints.between('md', 'lg')]: {
      width: '1.6rem', // Smaller width on small screens
      height: '1.6rem',
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: '1.18rem',
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

export default function ToggleSwitch(props) {
  return (
    <FormGroup sx={{ alignItems: 'center' }}>
      <FormControlLabel
        sx={{ margin: '0 !important' }}
        control={<CustomSwitch {...props} />}
      />
    </FormGroup>
  );
}
