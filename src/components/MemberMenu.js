import React from "react";
import { List } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";

const MemberMenu = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Posts", path: "/member/posts" },
    { name: "Collections", path: "/member/collections" },
    { name: "My Information", path: "/member/settings" },
  ];
  return (
    <List animated selection>
      {menuItems.map((menuItem) => {
        return (
          <List.Item
            key={menuItem.name}
            as={Link}
            to={menuItem.path}
            active={menuItem.path === location.pathname}
          >
            {menuItem.name}
          </List.Item>
        );
      })}
    </List>
  );
};

export default MemberMenu;
