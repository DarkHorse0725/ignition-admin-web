import React from "react";

const DeleteOutlineSymbol = (props: any) => {
  return (
    <>
      <svg width="18" height="18" viewBox="0 0 18 18" fill={props?.color || "#F00E0E"} xmlns="http://www.w3.org/2000/svg">
        <path d="M5.25 15.75C4.8375 15.75 4.4845 15.6033 4.191 15.3098C3.897 15.0158 3.75 14.6625 3.75 14.25V4.5H3V3H6.75V2.25H11.25V3H15V4.5H14.25V14.25C14.25 14.6625 14.1033 15.0158 13.8098 15.3098C13.5158 15.6033 13.1625 15.75 12.75 15.75H5.25ZM12.75 4.5H5.25V14.25H12.75V4.5ZM6.75 12.75H8.25V6H6.75V12.75ZM9.75 12.75H11.25V6H9.75V12.75ZM5.25 4.5V14.25V4.5Z"/>
      </svg>
    </>
  );
};

export default React.memo(DeleteOutlineSymbol);
