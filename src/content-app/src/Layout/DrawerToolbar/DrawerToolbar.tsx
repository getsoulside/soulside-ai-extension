import { toggleExtensionDrawer } from "@/domains/userProfile";
import { AppDispatch, RootState } from "@/store";
import {
  CalendarMonthRounded,
  CloseRounded,
  GroupsRounded,
  HomeRounded,
  PeopleRounded,
  PersonRounded,
} from "@mui/icons-material";
import { IconButton as MuiIconButton, Paper, Stack, styled, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link as NavLink } from "react-router-dom";

const IconButton = styled(MuiIconButton)(() => ({
  width: 42,
  height: 42,
  borderRadius: 12,
}));

const DrawerToolbar = () => {
  const dispatch: AppDispatch = useDispatch();
  const closeDrawer = () => {
    dispatch(toggleExtensionDrawer(false));
  };
  const selectedRole = useSelector((state: RootState) => state.userProfile.selectedRole);
  const userInfo = useSelector((state: RootState) => state.userProfile.info);
  const isLoggedIn = !!userInfo.data && !!selectedRole.data;
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent={"space-between"}
    >
      {isLoggedIn ? (
        <Stack
          direction="row"
          spacing={2}
        >
          <NavLink to={"/"}>
            <DrawerToolbarOption
              title="Appointments"
              Icon={CalendarMonthRounded}
            />
          </NavLink>
          <NavLink to={"/"}>
            <DrawerToolbarOption
              title="Patients"
              Icon={PeopleRounded}
            />
          </NavLink>
          <NavLink to={"/"}>
            <DrawerToolbarOption
              title="Groups"
              Icon={GroupsRounded}
            />
          </NavLink>
        </Stack>
      ) : (
        <Stack
          direction="row"
          spacing={2}
        >
          <DrawerToolbarOption
            title="Home"
            Icon={HomeRounded}
          />
        </Stack>
      )}

      <Stack
        direction="row"
        spacing={2}
      >
        {isLoggedIn && (
          <NavLink to={"/profile"}>
            <DrawerToolbarOption
              title="Profile"
              Icon={PersonRounded}
            />
          </NavLink>
        )}
        <DrawerToolbarOption
          title="Close"
          Icon={CloseRounded}
          onClick={closeDrawer}
        />
      </Stack>
    </Stack>
  );
};

export default DrawerToolbar;

interface DrawerToolbarOptionProps {
  Icon: React.ElementType;
  onClick?: () => void;
  title: string;
}

const DrawerToolbarOption: React.FC<DrawerToolbarOptionProps> = ({ Icon, onClick, title }) => {
  return (
    <Tooltip
      title={title}
      placement="top"
    >
      <Paper elevation={3}>
        <IconButton onClick={onClick ? onClick : () => {}}>
          <Icon />
        </IconButton>
      </Paper>
    </Tooltip>
  );
};
