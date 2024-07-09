import { Box, styled, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { MenuItemType } from "../ListItem";

interface MenuItemProps {
  isActive: boolean;
  item: MenuItemType;
}

const ItemContainer = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "10px",
  alignItems: "center",
  ":hover": {
    "& h6": {
      color: theme.palette.text.primary,
      transition: "color 0.5s",
    },
    "& div": {
      backgroundColor: theme.palette.primary.main,
      transition: "background-color 0.5s",
      "& svg": {
        fill: theme.palette.text.primary,
        transition: "fill 0.5s",
      },
    },
  },
}));

const MenuItem = ({
  isActive,
  item: { title, icon: Icon, link, isNewNotification = false },
}: MenuItemProps) => {
  const theme = useTheme();
  const contentColor = isActive
    ? theme.palette.text.primary
    : theme.palette.grey[500];
  return (
    <Link href={link}>
      <ItemContainer>
        <Box
          sx={{
            position: 'relative', // Ensure the position of the box is relative for absolute positioning of the dot
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isActive
              ? theme.palette.primary.main
              : theme.palette.grey[600],
          }}
        >
          <Icon fill={contentColor} />
          {isNewNotification && ( // Render the red dot only if isNewNotification is true
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '12.76px',
                height: '12.5px',
                borderRadius: '50%',
                backgroundColor: '#FF2929',
              }}
            />
          )}
        </Box>
        <Typography
          variant="h6"
          color={contentColor}
          sx={{ textDecoration: "none" }}
        >
          {title}
        </Typography>
      </ItemContainer>
    </Link>
  );
};

export default MenuItem;
