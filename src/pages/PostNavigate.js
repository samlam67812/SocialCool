import React from "react";
import { Route, Routes } from "react-router-dom";
import { Grid, Container } from "semantic-ui-react";
import SinglePost from "./SinglePost";
import Posts from "./Posts";
import Topics from "../components/Topics";

const PostNavigate = () => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Topics />
          </Grid.Column>
          <Grid.Column width={10}>
            <Routes>
              <Route path="*" element={<Posts />} exact />
              <Route path=":postId" element={<SinglePost />} exact />
            </Routes>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default PostNavigate;
