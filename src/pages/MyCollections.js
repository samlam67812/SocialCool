import React from "react";
import { Item, Header } from "semantic-ui-react";
import { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import Post from "../components/Post";
import { getAuth } from "firebase/auth";

const MyCollections = () => {
  const [posts, setPosts] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const loadData = async () => {
      const mypostRef = query(
        collection(firebase.db, "posts"),
        where("bookmark", "array-contains", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(mypostRef).then(
        (collectionSnapshot) => {
          const data = collectionSnapshot.docs.map((doc) => {
            const id = doc.id;
            return { ...doc.data(), id };
          });
          setPosts(data);
        }
      );
    };
    loadData();
  }, []);

  return (
    <>
      <Header>My Collections</Header>
      { !!posts ? "You did not save any posts yet" : Null }
      <Item.Group>
        {posts.map((post) => {
          return <Post post={post} key={post.id} />;
        })}
      </Item.Group>
    </>
  );
};

export default MyCollections;
