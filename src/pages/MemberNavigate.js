import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Grid, Container } from "semantic-ui-react";
import MemberMenu from "../components/MemberMenu";
import MyPosts from "./MyPosts";
import MySettings from "./MySettings";
import MyCollections from "./MyCollections";

const MemberNavigate = ({ user }) => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <MemberMenu />
          </Grid.Column>
          <Grid.Column width={10}>
            <Routes>
              <Route path="/posts" element={<MyPosts />} exact />
              <Route path="/settings" element={<MySettings user={user} />} />
              <Route path="/collections" element={<MyCollections />} />
              <Route path="/*" element={<Navigate replace to={"/member/settings"} />} />
            </Routes>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MemberNavigate;
