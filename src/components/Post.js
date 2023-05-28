import React from "react";
import { Item, Image, Icon } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <Item as={Link} to={`../../posts/${post.id}`}>
      <Item.Image
        src={
          post.imageUrl ||
          "https://react.semantic-ui.com/images/wireframe/image.png"
        }
        size="medium"
      />
      <Item.Content>
        <Item.Meta>
          {post.author.photoUrl ? (
            <Image
              src={post.author.photoUrl}
              avatar
              style={{
                fontSize: 10,
              }}
            />
          ) : (
            <Icon name="user circle" />
          )}
          {post.topic}・{post.author.displayName || "User"}
        </Item.Meta>
        <Item.Header>{post.title}</Item.Header>
        <Item.Description>{post.content.slice(0,50)+"..."}</Item.Description>
        <Item.Extra>
          Comment {post.commentsCount || 0}・Like {post.liked?.length || 0}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default Post;
