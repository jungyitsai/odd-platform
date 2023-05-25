import React from 'react';
import { type SvgIconProps } from '@mui/material/SvgIcon';
import AppSvgIcon from 'components/shared/icons/AppSvgIcon';

const DocumentIcon: React.FC<SvgIconProps> = ({ sx, ...props }) => (
  <AppSvgIcon sx={sx} width={25} height={24} viewBox='0 0 25 24' {...props}>
    <svg
      width='25'
      height='24'
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4.37868 1.87868C4.94129 1.31607 5.70435 1 6.5 1H14.5C14.7652 1 15.0196 1.10536 15.2071 1.29289L21.2071 7.29289C21.3946 7.48043 21.5 7.73478 21.5 8V20C21.5 20.7957 21.1839 21.5587 20.6213 22.1213C20.0587 22.6839 19.2957 23 18.5 23H6.5C5.70435 23 4.94129 22.6839 4.37868 22.1213C3.81607 21.5587 3.5 20.7957 3.5 20V4C3.5 3.20435 3.81607 2.44129 4.37868 1.87868ZM6.5 3C6.23478 3 5.98043 3.10536 5.79289 3.29289C5.60536 3.48043 5.5 3.73478 5.5 4V20C5.5 20.2652 5.60536 20.5196 5.79289 20.7071C5.98043 20.8946 6.23478 21 6.5 21H18.5C18.7652 21 19.0196 20.8946 19.2071 20.7071C19.3946 20.5196 19.5 20.2652 19.5 20V9H14.5C13.9477 9 13.5 8.55228 13.5 8V3H6.5ZM15.5 4.41421L18.0858 7H15.5V4.41421ZM7.5 9C7.5 8.44772 7.94772 8 8.5 8H10.5C11.0523 8 11.5 8.44772 11.5 9C11.5 9.55228 11.0523 10 10.5 10H8.5C7.94772 10 7.5 9.55228 7.5 9ZM7.5 13C7.5 12.4477 7.94772 12 8.5 12H16.5C17.0523 12 17.5 12.4477 17.5 13C17.5 13.5523 17.0523 14 16.5 14H8.5C7.94772 14 7.5 13.5523 7.5 13ZM7.5 17C7.5 16.4477 7.94772 16 8.5 16H16.5C17.0523 16 17.5 16.4477 17.5 17C17.5 17.5523 17.0523 18 16.5 18H8.5C7.94772 18 7.5 17.5523 7.5 17Z'
        fill='currentColor'
      />
    </svg>
  </AppSvgIcon>
);

export default DocumentIcon;