import { Item } from "semantic-ui-react";
import { useEffect, useRef, useState } from "react";
import firebase from "../utils/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import Post from "../components/Post";
import { useLocation } from "react-router-dom";
import { Waypoint } from "react-waypoint";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const lastPostSnapShotRef = useRef();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get("topic");

  useEffect(() => {
    if (currentTopic) {
      const postRef = query(
        collection(firebase.db, "posts"),
        where("topic", "array-contains", currentTopic),
        orderBy("createAt", "desc"), // show the latest posts
        limit(5)
      );
      const querySnapshot = getDocs(postRef).then((collectionSnapshot) => {
        const data = collectionSnapshot.docs.map((doc) => {
          const id = doc.id;
          return { ...doc.data(), id };
        });
        lastPostSnapShotRef.current =
          collectionSnapshot.docs[collectionSnapshot.docs.length - 1];

        setPosts(data);
      });
    } else {
      const postRef = query(
        collection(firebase.db, "posts"),
        orderBy("createAt", "desc"),
        limit(5)
      );
      const querySnapshot = getDocs(postRef).then((collectionSnapshot) => {
        const data = collectionSnapshot.docs.map((doc) => {
          const id = doc.id;
          return { ...doc.data(), id };
        });
        lastPostSnapShotRef.current =
          collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
        setPosts(data);
      });
    }
  }, [currentTopic]);

  return (
    <>
      <Item.Group>
        {posts.map((post) => {
          return <Post post={post} key={post.id} />;
        })}
      </Item.Group>

        <Waypoint
          onEnter={() => {
            if (lastPostSnapShotRef.current) {
              if (currentTopic) {
                const postRef = query(
                  collection(firebase.db, "posts"),
                  where("topic", "==", currentTopic),
                  orderBy("createAt", "desc"), // show the latest posts
                  startAfter(lastPostSnapShotRef.current),
                  limit(5)
                );
                const querySnapshot = getDocs(postRef)
                  .then((collectionSnapshot) => {
                    const data = collectionSnapshot.docs.map((doc) => {
                      const id = doc.id;
                      return { ...doc.data(), id };
                    });
                    lastPostSnapShotRef.current =
                      collectionSnapshot.docs[
                        collectionSnapshot.docs.length - 1
                      ];
                    setPosts([...posts, ...data]);
                  })
                  .catch((error) => console.log(error));
              } else {
                const postRef = query(
                  collection(firebase.db, "posts"),
                  orderBy("createAt", "desc"),
                  startAfter(lastPostSnapShotRef.current),
                  limit(5)
                );
                const querySnapshot = getDocs(postRef)
                  .then((collectionSnapshot) => {
                    const data = collectionSnapshot.docs.map((doc) => {
                      const id = doc.id;
                      return { ...doc.data(), id };
                    });
                    lastPostSnapShotRef.current =
                      collectionSnapshot.docs[
                        collectionSnapshot.docs.length - 1
                      ];
                    setPosts([...posts, ...data]);
                  })
                  .catch((error) => console.log(error));
              }
            }
          }}
        />
        
    </>
  );
};

export default Posts;
