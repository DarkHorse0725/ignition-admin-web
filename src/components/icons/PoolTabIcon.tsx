import { IIconProps } from './InformationIcon';

export const PoolTabIcon = (props: IIconProps) => {
  const { size = 18, color = 'white' } = props;
  return (
    <>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.25 3H15.75V4.5H8.25V3ZM8.25 6H12.75V7.5H8.25V6ZM8.25 10.5H15.75V12H8.25V10.5ZM8.25 13.5H12.75V15H8.25V13.5ZM2.25 3H6.75V7.5H2.25V3ZM3.75 4.5V6H5.25V4.5H3.75ZM2.25 10.5H6.75V15H2.25V10.5ZM3.75 12V13.5H5.25V12H3.75Z"
          fill={color}
        />
      </svg>
    </>
  );
};
